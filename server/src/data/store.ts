import { Task, Project, User, TeamMember } from "@shared/types";
import bcrypt from "bcrypt"; 

export let PROJECTS: Project[] = [
  { id: "p1", name: "Design System v2", description: "Unify tokens and components across product surfaces.", status: "on-track", progress: 72, members: ["Sarah Patel", "Alex Kim", "Jo Chen"], taskCount: 24, completedTaskCount: 17, dueDate: "2026-09-15" },
  { id: "p2", name: "API Gateway Migration", description: "Move legacy REST endpoints to the new gateway.", status: "at-risk", progress: 41, members: ["Max Lee", "Priya Rao"], taskCount: 18, completedTaskCount: 7, dueDate: "2026-09-01" },
  { id: "p3", name: "Mobile Onboarding Revamp", description: "Redesign first-run experience for iOS and Android.", status: "delayed", progress: 25, members: ["Jo Chen", "Sarah Patel", "Max Lee", "Priya Rao"], taskCount: 30, completedTaskCount: 6, dueDate: "2026-08-30" },
  { id: "p4", name: "Analytics Pipeline", description: "Event tracking and dashboarding for product usage.", status: "completed", progress: 100, members: ["Alex Kim"], taskCount: 14, completedTaskCount: 14, dueDate: "2026-08-10" },
];

export let TASKS: Task[] = [
  { id: "t1", title: "Finalize color token naming", status: "in-progress", priority: "high", projectId: "p1", assignee: "Sarah Patel", dueDate: "2026-08-25" },
  { id: "t2", title: "Audit legacy auth endpoints", status: "todo", priority: "high", projectId: "p2", assignee: "Max Lee", dueDate: "2026-08-24" },
  { id: "t3", title: "Write on boarding copy v2", status: "review", priority: "medium", projectId: "p3", assignee: "Jo Chen", dueDate: "2026-08-27" },
  { id: "t4", title: "Set up rate limiting", status: "todo", priority: "high", projectId: "p2", assignee: "Priya Rao", dueDate: "2026-08-26" },
  { id: "t5", title: "Component docs pass", status: "done", priority: "low", projectId: "p1", assignee: "Alex Kim", dueDate: "2026-08-20" },
  { id: "t6", title: "Prototype swipe gestures", status: "in-progress", priority: "medium", projectId: "p3", assignee: "Sarah Patel", dueDate: "2026-08-29" },
];

export let TEAM_MEMBERS: TeamMember[] = [
  { id: "m1", name: "Sarah Patel", role: "Frontend Engineer", email: "sarah@xyz.com" },
  { id: "m2", name: "Alex Kim", role: "Product Designer", email: "alex@xyz.com" },
  { id: "m3", name: "Jo Chen", role: "Backend Engineer", email: "joe@xyz.com" },
  { id: "m4", name: "Max Lee", role: "Full-stack Engineer", email: "max@xyz.com" },
];

export let USERS: User[] = [
  {
    id: "u1",
    name: "Sarah Patel",
    role: "Frontend Engineer",
    email: "sarah@xyz.com",
    password: "password123", // mock only — for demo change-password validation
  },
];

export const CURRENT_USER = USERS[0];

export function getAllTasks() { 
  return TASKS; 
} 
  
export function getTaskById(id: string) { 
  return TASKS.find(t => t.id === id); 
}

export function createTask(data: Omit<Task, "id">) {
  const newTask: Task = {
    id: `t${Date.now()}`,
    ...data
  };

  TASKS.push(newTask);
  return newTask;
}

export function updateTask(id: string, updates: Partial<Task>) {
  const task = TASKS.find(t => t.id === id);

  if (!task) return null;

  Object.assign(task, updates);
  return task;
}

export function deleteTask(id: string) {
  const index = TASKS.findIndex(t => t.id === id);

  if (index === -1) return false;

  TASKS.splice(index, 1);
  return true;
}

export function getAllProjects() {
  return PROJECTS;
}

export function getProjectById(id: string) {
  return PROJECTS.find(p => p.id === id);
}

export function createProject(
  data: Omit<Project, "id" | "taskCount" | "completedTaskCount">
) {
  const newProject: Project = {
    id: `p${Date.now()}`,
    ...data,
    taskCount: 0,
    completedTaskCount: 0
  };

  PROJECTS.push(newProject);
  return newProject;
}

export function updateProject(id: string, updates: Partial<Project>) {
  const project = PROJECTS.find(p => p.id === id);

  if (!project) return null;

  Object.assign(project, updates);
  return project;
}

export function deleteProject(id: string) {
  const index = PROJECTS.findIndex(p => p.id === id);

  if (index === -1) return false;

  PROJECTS.splice(index, 1);
  return true;
}

export function getAllTeamMembers() {
  return TEAM_MEMBERS;
}

export function getTeamMemberById(id: string) {
  return TEAM_MEMBERS.find(m => m.id === id);
}

export function createTeamMember(data: Omit<TeamMember, "id">) {
  const newTeamMember: TeamMember = {
    id: `m${Date.now()}`,
    ...data
  };

  TEAM_MEMBERS.push(newTeamMember);
  return newTeamMember;
}

export function updateTeamMember(
  id: string,
  updates: Partial<TeamMember>
) {
  const teamMember = TEAM_MEMBERS.find(m => m.id === id);

  if (!teamMember) return null;

  Object.assign(teamMember, updates);
  return teamMember;
}

export function deleteTeamMember(id: string) {
  const index = TEAM_MEMBERS.findIndex(m => m.id === id);

  if (index === -1) return false;

  TEAM_MEMBERS.splice(index, 1);
  return true;
}

export function getAllUsers() {
  return USERS;
}

export function getUserById(id: string) {
  return USERS.find((u) => u.id === id);
}

export async function createUser( data: Omit<User, "id"> ) { 
  if (!data.password) { 
    throw new Error("Password is required"); 
  } const hashedPassword = await bcrypt.hash(data.password, 10); 
  const newUser: User = { 
    id: `u${Date.now()}`, ...data, 
    password: hashedPassword, 
  }; 
  USERS.push(newUser); 
  return newUser; 
} 

export async function updateUser(id: string, updates: Partial<User>) { 
  const user = USERS.find(u => u.id === id); 
  if (!user) return null; 
  if (updates.password) { 
    updates.password = await bcrypt.hash(updates.password, 10); 
  } 
  Object.assign(user, updates); 
  return user; 
}

export function deleteUser(id: string) {
  const index = USERS.findIndex((u) => u.id === id);

  if (index === -1) return false;

  USERS.splice(index, 1);
  return true;
}
