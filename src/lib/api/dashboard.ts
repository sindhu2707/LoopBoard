import { DashboardStats, ActivityEvent } from "@/types";
import { api } from "@/lib/api";

export async function fetchStats(): Promise<DashboardStats> {
  return api.get<DashboardStats>("/api/dashboard/stats");
}

export async function fetchActivity(): Promise<ActivityEvent[]> {
  return api.get<ActivityEvent[]>("/api/activity");
}