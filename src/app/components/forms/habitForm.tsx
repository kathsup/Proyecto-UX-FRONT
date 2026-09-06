"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Typography,
  Card,
  CardContent,
  Grid,
  MenuItem,
} from "@mui/material";
import { habitSchema } from "@/app/lib/validations/habits";
import { createHabit, updateHabit } from "@/app/services/habits.service";
import { useAuth } from "@/app/context/AuthContext";

const predefinedHabits = [
  { name: "Beber agua", category: "Salud" },
  { name: "Leer", category: "Educación" },
  { name: "Caminar", category: "Salud" },
  { name: "Hacer ejercicio", category: "Salud" },
];

const categoryOptions = ["Salud", "Educación", "Personal"];
const frequencyOptions = ["Diaria", "Semanal", "Personalizada"];
const priorityOptions = ["Alta", "Media", "Baja"];

export type HabitFormValues = {
  name: string;
  description: string;
  category: string;
  frequency: string;
  priority: string;
  startDate: string;
  endDate: string;
};

type Props = {
  habitId?: string;
  initialValues?: Partial<HabitFormValues>;
  onSuccess?: () => void;
};

function toInputDate(value?: string) {
  return value ? value.slice(0, 10) : ""; // "2026-08-01T00:00:00Z" -> "2026-08-01"
}

export function HabitForm({ habitId, initialValues, onSuccess }: Props) {
  const isEditing = Boolean(habitId);
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<HabitFormValues>({
    name: initialValues?.name ?? "",
    description: initialValues?.description ?? "",
    category: initialValues?.category ?? "",
    frequency: initialValues?.frequency ?? "",
    priority: initialValues?.priority ?? "",
    startDate: toInputDate(initialValues?.startDate),
    endDate: toInputDate(initialValues?.endDate),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function update<K extends keyof HabitFormValues>(field: K, value: string) {
    setForm({ ...form, [field]: value });
  }

  function validate() {
    const result = habitSchema.safeParse(form);
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

  function buildPayload() {
    return {
      name: form.name,
      frequency: form.frequency,
      startDate: form.startDate,
      ...(form.description && { description: form.description }),
      ...(form.category && { category: form.category }),
      ...(form.priority && { priority: form.priority }),
      ...(form.endDate && { endDate: form.endDate }),
    };
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEditing && habitId) {
        await updateHabit(habitId, buildPayload());
      } else if (user) {
        await createHabit({ ...buildPayload(), userId: user.id });
      }
      onSuccess?.();
      router.push("/habits");
    } catch {
      setApiError("No se pudo guardar el hábito. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card component="form" onSubmit={handleSubmit} elevation={2}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={600}>
            {isEditing ? "Editar hábito" : "Nuevo hábito"}
          </Typography>
          {apiError && <Alert severity="error">{apiError}</Alert>}

          {!isEditing && (
            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: "wrap", gap: 1 }}
            >
              {" "}
              {predefinedHabits.map((habit) => (
                <Button
                  key={habit.name}
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    setForm({
                      ...form,
                      name: habit.name,
                      category: habit.category,
                    })
                  }
                >
                  {habit.name}
                </Button>
              ))}
            </Stack>
          )}

          <TextField
            label="Nombre del hábito"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            label="Descripción"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={2}
          />

          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                select
                label="Categoría"
                fullWidth
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                {categoryOptions.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={6}>
              <TextField
                select
                label="Prioridad"
                fullWidth
                value={form.priority}
                onChange={(e) => update("priority", e.target.value)}
              >
                {priorityOptions.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <TextField
            select
            label="Frecuencia"
            value={form.frequency}
            onChange={(e) => update("frequency", e.target.value)}
            error={!!errors.frequency}
            helperText={errors.frequency}
          >
            {frequencyOptions.map((f) => (
              <MenuItem key={f} value={f}>
                {f}
              </MenuItem>
            ))}
          </TextField>

          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                label="Fecha de inicio"
                type="date"
                fullWidth
                value={form.startDate}
                onChange={(e) => update("startDate", e.target.value)}
                error={!!errors.startDate}
                helperText={errors.startDate}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Fecha de fin (opcional)"
                type="date"
                fullWidth
                value={form.endDate}
                onChange={(e) => update("endDate", e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : isEditing ? (
              "Guardar cambios"
            ) : (
              "Crear hábito"
            )}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
