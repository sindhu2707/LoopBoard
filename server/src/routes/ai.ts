import { Router } from "express";
import { getProjectById } from "../data/store";
import { generateTasksSchema } from "../schemas/ai";
import { asyncHandler } from "../middleware/asyncHandler";
import { NotFoundError, ValidationError } from "../errors/AppError";
import { genAI } from "../lib/gemini";
import { TaskPriority } from "@shared/types";

interface SuggestedTask {
  title: string;
  priority: TaskPriority;
  dueInDays: number;
}

function isSuggestedTask(value: unknown): value is SuggestedTask {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.title === "string" &&
    (v.priority === "low" || v.priority === "medium" || v.priority === "high") &&
    typeof v.dueInDays === "number"
  );
}

function toDateOnly(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 10);
}

const router = Router();

router.post(
  "/tasks/generate",
  asyncHandler(async (req, res) => {
    const result = generateTasksSchema.safeParse(req.body);
    if (!result.success)
      throw new ValidationError("Invalid request", result.error.issues);

    const project = await getProjectById(result.data.projectId);
    if (!project) throw new NotFoundError("Project not found");

    const count = result.data.count ?? 5;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt =
      "You are a project planning assistant. Given a project's name and description, " +
      "propose a concise, realistic list of engineering/product tasks needed to move it forward. " +
      'Respond with ONLY a JSON array. Each item must be: ' +
      '{"title": string, "priority": "low" | "medium" | "high", "dueInDays": integer between 1 and 30}.\n\n' +
      `Project: ${project.name}\nDescription: ${project.description}\n\nGenerate exactly ${count} tasks.`;

    const response = await model.generateContent(prompt);
    const text = response.response.text();

    const cleaned = text.replace(/```json|```/g, "").trim();
    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error("Failed to parse AI response as JSON");
    }

    if (!Array.isArray(parsed) || !parsed.every(isSuggestedTask)) {
      throw new Error("AI response did not match the expected task format");
    }

    const suggestions = parsed.map((task) => ({
      title: task.title,
      priority: task.priority,
      dueDate: toDateOnly(task.dueInDays),
    }));

    res.json(suggestions);
  })
);

export default router;