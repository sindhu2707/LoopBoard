import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import {
  Task,
  Project,
  User,
  TeamMember,
} from "@shared/types";
import { NotFoundError } from "../errors/AppError";

// -----------------------------------------------------------------------
// Shared helpers
// -----------------------------------------------------------------------

/** date-only fields ("2026-09-15") round-trip cleanly through Postgres `date` columns */
function toDateOnly(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function fromDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

/**
 * Prisma throws typed errors for constraint violations. We translate the
 * ones our routes care about into the same AppError subclasses the routes
 * already know how to handle, so a bad `projectId`/`assigneeId` on write
 * comes back as a clean 404 instead of a raw 500.
 */
function translatePrismaError(err: unknown): never {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      throw new NotFoundError("Resource not found");
    }
    if (err.code === "P2003") {
      throw new NotFoundError(
        "Referenced project or team member does not exist"
      );
    }
  }
  throw err;
}

// -----------------------------------------------------------------------
// Tasks
// -----------------------------------------------------------------------

type TaskWithAssignee = Prisma.TaskGetPayload<{
  include: { assignee: true };
}>;

function serializeTask(task: TaskWithAssignee): Task {
  return {
    id: task.id,
    title: task.title,
    status: task.status as Task["status"],
    priority: task.priority as Task["priority"],
    projectId: task.projectId,
    assigneeId: task.assigneeId,
    assignee: task.assignee?.name ?? null,
    dueDate: fromDateOnly(task.dueDate),
  };
}

export async function getAllTasks() {
  const tasks = await prisma.task.findMany({
    include: { assignee: true },
    orderBy: { createdAt: "asc" },
  });
  return tasks.map(serializeTask);
}

export async function getTaskById(id: string) {
  const task = await prisma.task.findUnique({
    where: { id },
    include: { assignee: true },
  });
  return task ? serializeTask(task) : null;
}

export async function createTask(data: Omit<Task, "id" | "assignee">) {
  try {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        status: data.status,
        priority: data.priority,
        dueDate: toDateOnly(data.dueDate),
        project: { connect: { id: data.projectId } },
        ...(data.assigneeId
          ? { assignee: { connect: { id: data.assigneeId } } }
          : {}),
      },
      include: { assignee: true },
    });
    return serializeTask(task);
  } catch (err) {
    translatePrismaError(err);
  }
}

export async function updateTask(
  id: string,
  updates: Partial<Omit<Task, "id" | "assignee">>
) {
  try {
    const { projectId, assigneeId, dueDate, ...rest } = updates;

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...rest,
        ...(dueDate ? { dueDate: toDateOnly(dueDate) } : {}),
        ...(projectId ? { project: { connect: { id: projectId } } } : {}),
        ...(assigneeId !== undefined
          ? assigneeId
            ? { assignee: { connect: { id: assigneeId } } }
            : { assignee: { disconnect: true } }
          : {}),
      },
      include: { assignee: true },
    });
    return serializeTask(task);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return null;
    }
    translatePrismaError(err);
  }
}

export async function deleteTask(id: string) {
  try {
    await prisma.task.delete({ where: { id } });
    return true;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return false;
    }
    throw err;
  }
}

// -----------------------------------------------------------------------
// Projects
// -----------------------------------------------------------------------

type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: {
    memberLinks: { include: { teamMember: true } };
    tasks: { select: { status: true } };
  };
}>;

function serializeProject(project: ProjectWithRelations): Project {
  const members = project.memberLinks.map((link) => link.teamMember);
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status as Project["status"],
    progress: project.progress,
    memberIds: members.map((m) => m.id),
    members: members.map((m) => m.name),
    taskCount: project.tasks.length,
    completedTaskCount: project.tasks.filter((t) => t.status === "done")
      .length,
    dueDate: fromDateOnly(project.dueDate),
  };
}

const projectInclude = {
  memberLinks: { include: { teamMember: true } },
  tasks: { select: { status: true } },
} satisfies Prisma.ProjectInclude;

export async function getAllProjects() {
  const projects = await prisma.project.findMany({
    include: projectInclude,
    orderBy: { createdAt: "asc" },
  });
  return projects.map(serializeProject);
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: projectInclude,
  });
  return project ? serializeProject(project) : null;
}

export async function createProject(
  data: Omit<Project, "id" | "taskCount" | "completedTaskCount" | "members">
) {
  try {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
        progress: data.progress,
        dueDate: toDateOnly(data.dueDate),
        memberLinks: {
          create: (data.memberIds ?? []).map((teamMemberId) => ({
            teamMember: { connect: { id: teamMemberId } },
          })),
        },
      },
      include: projectInclude,
    });
    return serializeProject(project);
  } catch (err) {
    translatePrismaError(err);
  }
}

export async function updateProject(
  id: string,
  updates: Partial<
    Omit<Project, "id" | "taskCount" | "completedTaskCount" | "members">
  >
) {
  try {
    const { memberIds, dueDate, ...rest } = updates;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...rest,
        ...(dueDate ? { dueDate: toDateOnly(dueDate) } : {}),
        ...(memberIds
          ? {
              memberLinks: {
                deleteMany: {},
                create: memberIds.map((teamMemberId) => ({
                  teamMember: { connect: { id: teamMemberId } },
                })),
              },
            }
          : {}),
      },
      include: projectInclude,
    });
    return serializeProject(project);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return null;
    }
    translatePrismaError(err);
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    return true;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return false;
    }
    throw err;
  }
}

// -----------------------------------------------------------------------
// Team members
// -----------------------------------------------------------------------

function serializeTeamMember(member: {
  id: string;
  name: string;
  role: string;
  email: string;
}): TeamMember {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    email: member.email,
  };
}

export async function getAllTeamMembers() {
  const members = await prisma.teamMember.findMany({
    orderBy: { createdAt: "asc" },
  });
  return members.map(serializeTeamMember);
}

export async function getTeamMemberById(id: string) {
  const member = await prisma.teamMember.findUnique({ where: { id } });
  return member ? serializeTeamMember(member) : null;
}

export async function createTeamMember(data: Omit<TeamMember, "id">) {
  try {
    const member = await prisma.teamMember.create({ data });
    return serializeTeamMember(member);
  } catch (err) {
    translatePrismaError(err);
  }
}

export async function updateTeamMember(
  id: string,
  updates: Partial<TeamMember>
) {
  try {
    const member = await prisma.teamMember.update({
      where: { id },
      data: updates,
    });
    return serializeTeamMember(member);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return null;
    }
    translatePrismaError(err);
  }
}

export async function deleteTeamMember(id: string) {
  try {
    await prisma.teamMember.delete({ where: { id } });
    return true;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return false;
    }
    throw err;
  }
}

// -----------------------------------------------------------------------
// Users
// -----------------------------------------------------------------------

function serializeUser(user: {
  id: string;
  name: string;
  role: string;
  email: string;
  password: string;
  avatarInitials: string | null;
}): User {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    password: user.password,
    avatarInitials: user.avatarInitials ?? undefined,
  };
}

export async function getAllUsers() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  return users.map(serializeUser);
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? serializeUser(user) : null;
}

export async function createUser(data: Omit<User, "id">) {
  if (!data.password) {
    throw new Error("Password is required");
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  try {
    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
    return serializeUser(user);
  } catch (err) {
    translatePrismaError(err);
  }
}

export async function updateUser(id: string, updates: Partial<User>) {
  const data = { ...updates };
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  try {
    const user = await prisma.user.update({ where: { id }, data });
    return serializeUser(user);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return null;
    }
    translatePrismaError(err);
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    return true;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return false;
    }
    throw err;
  }
}

/**
 * Placeholder until Task 4 adds real session/JWT auth — returns the first
 * seeded user so existing consumers keep working. Replace with the
 * authenticated request's user once login exists.
 */
export async function getCurrentUser() {
  const user = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  return user ? serializeUser(user) : null;
}
