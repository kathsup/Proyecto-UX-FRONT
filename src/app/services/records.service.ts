import { apiFetch } from "../lib/api";

export async function createRecord(habitId: string, date: string) {
  return apiFetch("/records", {
    method: "POST",
    body: JSON.stringify({ habitId, date, completed: true }),
  });
}

export async function getRecords() {
  return apiFetch("/records");
}

export async function deleteRecord(id: string) {
  return apiFetch(`/records/${id}`, { method: "DELETE" });
}
