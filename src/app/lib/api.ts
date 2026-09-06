const API_URL = "http://localhost:3000"; // o el puerto del backend NestJS

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
