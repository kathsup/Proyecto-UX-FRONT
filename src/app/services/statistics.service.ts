import { apiFetch } from "../lib/api";
import type { DashboardData } from "../types/statistics";

export async function getDashboard(date: string): Promise<DashboardData> {
  return apiFetch(`/statistics/dashboard?date=${date}`);
}
