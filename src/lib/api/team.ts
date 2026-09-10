import { TeamMember } from "@/types";
import { api } from "@/lib/api";

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  return api.get<TeamMember[]>("/api/team");
}