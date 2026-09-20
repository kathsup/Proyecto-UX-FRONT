import { apiFetch } from "../lib/api";
import type { HabitRecord, Matrix, Progress } from "../types/records";

export async function upsertRecord(
  habitId: string,
  date: string, // "YYYY-MM-DD"
  value: number,
): Promise<HabitRecord> {
  return apiFetch("/records", {
    method: "PUT",
    body: JSON.stringify({ habitId, date, value }),
  });
}

export async function getRecords(): Promise<HabitRecord[]> {
  return apiFetch("/records");
}

export async function getMatrix(from: string, to: string): Promise<Matrix> {
  return apiFetch(`/records/matrix?from=${from}&to=${to}`);
}

export async function getProgress(
  habitId: string,
  period: "daily" | "weekly" | "monthly",
  date: string,
): Promise<Progress> {
  return apiFetch(
    `/records/habit/${habitId}/progress?period=${period}&date=${date}`,
  );
}
