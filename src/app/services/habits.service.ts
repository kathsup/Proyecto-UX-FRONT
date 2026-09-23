import { apiFetch } from "../lib/api";
import type { Habit, HabitPayload, HabitsFilter } from "../types/habits";

export async function createHabit(data: HabitPayload): Promise<Habit> {
  return apiFetch("/habits", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getHabits(filter?: HabitsFilter) {
  const params = new URLSearchParams();
  if (filter?.search) params.set("search", filter.search);
  if (filter?.category) params.set("category", filter.category);
  if (filter?.active !== undefined) params.set("active", String(filter.active));
  if (filter?.sort) params.set("sort", filter.sort);

  const query = params.toString();
  return apiFetch(`/habits${query ? `?${query}` : ""}`);
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
