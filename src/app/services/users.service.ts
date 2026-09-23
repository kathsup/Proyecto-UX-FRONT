import { apiFetch } from "../lib/api";
import type { Me } from "../types/user";

export async function getMe(): Promise<Me> {
  return apiFetch("/users/me");
}
