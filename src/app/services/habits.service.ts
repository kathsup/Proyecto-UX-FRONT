import { apiFetch } from "../lib/api";
import { HabitForm } from "../components/forms/habitForm";

export async function createHabit(form: typeof HabitForm & { userId: string }) {
  return apiFetch("/habits", {
    method: "POST",
    body: JSON.stringify(form),
  });
}

export async function getHabits() {
  return apiFetch("/habits");
}

export async function getHabitById(id: string) {
  return apiFetch(`/habits/${id}`);
}

export async function updateHabit(id: string, form: Partial<typeof HabitForm>) {
  return apiFetch(`/habits/${id}`, {
    method: "PATCH",
    body: JSON.stringify(form),
  });
}

export async function deleteHabit(id: string) {
  return apiFetch(`/habits/${id}`, {
    method: "DELETE",
  });
}
