"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAuth } from "../context/AuthContext";
import { loginSchema } from "../lib/validations/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) newErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push("/dashboard");
    } catch {
      setApiError("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      spacing={2}
      sx={{ maxWidth: 360, mx: "auto", mt: 10 }}
    >
      <Typography variant="h5" align="center">
        Iniciar sesión
      </Typography>
      {apiError && <Alert severity="error">{apiError}</Alert>}
      <TextField
        label="Correo electrónico"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        label="Contraseña"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        error={!!errors.password}
        helperText={errors.password}
      />
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Entrar"}
      </Button>
    </Stack>
  );
}
