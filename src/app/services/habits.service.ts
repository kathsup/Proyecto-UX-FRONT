import { apiFetch } from "../lib/api";
import type { Habit, HabitPayload } from "../types/habits";

export async function createHabit(data: HabitPayload): Promise<Habit> {
  return apiFetch("/habits", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getHabits(): Promise<Habit[]> {
  return apiFetch("/habits");
}

export async function getHabitById(id: string): Promise<Habit> {
  return apiFetch(`/habits/${id}`);
}

export async function updateHabit(
  id: string,
  data: Partial<HabitPayload>,
): Promise<Habit> {
  return apiFetch(`/habits/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteHabit(id: string) {
  return apiFetch(`/habits/${id}`, {
    method: "DELETE",
  });
}
