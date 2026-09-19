"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../lib/api";

type User = { id: string; email: string; name: string };
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  initializing: boolean; //proteger
};

const AuthContext = createContext<AuthContextType | null>(null);

function decodeToken(token: string): User {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true); //agregado para proteger ruta

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        setUser(decodeToken(token));
      } catch {
        sessionStorage.removeItem("token");
      }
    }
    setInitializing(false);
  }, []);

  async function login(email: string, password: string) {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    console.log("login con sessionStorage");
    sessionStorage.setItem("token", data.token);
    setUser(decodeToken(data.token));
  }

  async function register(name: string, email: string, password: string) {
    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    await login(email, password);
  }

  function logout() {
    sessionStorage.removeItem("token");
    setUser(null);
  }

  return (
    //proteger
    <AuthContext.Provider
      value={{ user, login, register, logout, initializing }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
