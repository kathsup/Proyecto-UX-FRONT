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
import { registerSchema } from "../lib/validations/auth";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const result = registerSchema.safeParse(form);
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
      await register(form.name, form.email, form.password);
      router.push("/dashboard");
    } catch {
      setApiError("No se pudo crear la cuenta. ¿Ya existe ese correo?");
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
        Crear cuenta
      </Typography>
      {apiError && <Alert severity="error">{apiError}</Alert>}
      <TextField
        label="Nombre completo"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        error={!!errors.name}
        helperText={errors.name}
      />
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
        {loading ? <CircularProgress size={24} /> : "Registrarme"}
      </Button>
    </Stack>
  );
}
