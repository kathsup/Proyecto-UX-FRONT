import { apiFetch } from "../lib/api";
import type {
  DashboardData,
  OverviewData,
  HeatmapDay,
} from "../types/statistics";

export async function getDashboard(date: string): Promise<DashboardData> {
  return apiFetch(`/statistics/dashboard?date=${date}`);
}

export async function getOverview(date: string): Promise<OverviewData> {
  return apiFetch(`/statistics/overview?date=${date}`);
}

export async function getHeatmap(days: number): Promise<HeatmapDay[]> {
  return apiFetch(`/statistics/heatmap?days=${days}`);
}
