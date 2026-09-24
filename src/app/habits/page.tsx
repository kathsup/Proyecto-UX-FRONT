"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ProtectedRoute from "../components/ProtectedRoute";
import HabitCard from "../components/habits/card";
import Grid from "@mui/material/Grid";

import {
  getHabits,
  deleteHabit,
  updateHabit,
} from "../services/habits.service";
import { categoryOptions } from "../lib/habitOptions";
import type { Habit } from "../types/habits";

export default function HabitsPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [active, setActive] = useState<"all" | "true" | "false">("all");
  const [sort, setSort] = useState<"createdAt" | "name" | "priority">(
    "createdAt",
  );

  async function loadHabits() {
    setLoading(true);
    try {
      const data = await getHabits({
        search: search || undefined,
        category: category || undefined,
        active: active === "all" ? undefined : active === "true",
        sort,
      });
      setHabits(data);
    } catch {
      setFeedback({ type: "error", msg: "No se pudieron cargar los hábitos" });
    } finally {
      setLoading(false);
    }
  }

  // Espera un momento tras dejar de escribir antes de buscar
  useEffect(() => {
    const timeout = setTimeout(loadHabits, 400);
    return () => clearTimeout(timeout);
  }, [search, category, active, sort]);

  async function handleToggleActive(id: string, newActive: boolean) {
    // Actualiza la tarjeta al instante, sin esperar al backend
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, active: newActive } : h)),
    );
    try {
      await updateHabit(id, { active: newActive });
    } catch {
      // Si falla, revierte el cambio y avisa
      setHabits((prev) =>
        prev.map((h) => (h.id === id ? { ...h, active: !newActive } : h)),
      );
      setFeedback({ type: "error", msg: "No se pudo actualizar el hábito" });
    }
  }

  async function confirmDelete() {
    if (!habitToDelete) return;
    try {
      await deleteHabit(habitToDelete);
      setFeedback({ type: "success", msg: "Hábito eliminado" });
      loadHabits();
    } catch {
      setFeedback({ type: "error", msg: "No se pudo eliminar el hábito" });
    } finally {
      setHabitToDelete(null);
    }
  }

  return (
    <ProtectedRoute>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Mis hábitos
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 3, flexWrap: "wrap", gap: 2 }}
      >
        <TextField
          label="Buscar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 200, flex: 1 }}
        />
        <TextField
          select
          label="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">Todas</MenuItem>
          {categoryOptions.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Estado"
          value={active}
          onChange={(e) => setActive(e.target.value as typeof active)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="true">Activos</MenuItem>
          <MenuItem value="false">Inactivos</MenuItem>
        </TextField>
        <TextField
          select
          label="Ordenar por"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="createdAt">Más recientes</MenuItem>
          <MenuItem value="name">Nombre</MenuItem>
          <MenuItem value="priority">Prioridad</MenuItem>
        </TextField>
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : habits.length === 0 ? (
        <Typography color="text.secondary">
          No se encontraron hábitos con esos filtros.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {habits.map((habit) => (
            <Grid key={habit.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <HabitCard
                habit={habit}
                onEdit={(id) => router.push(`/habits/${id}/edit`)}
                onDelete={(id) => setHabitToDelete(id)}
                onToggleActive={handleToggleActive}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={!!habitToDelete} onClose={() => setHabitToDelete(null)}>
        <DialogTitle>¿Eliminar este hábito?</DialogTitle>
        <DialogContent>Esta acción no se puede deshacer.</DialogContent>
        <DialogActions>
          <Button onClick={() => setHabitToDelete(null)}>Cancelar</Button>
          <Button color="error" onClick={confirmDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {feedback && (
        <Snackbar
          open={!!feedback}
          autoHideDuration={3000}
          onClose={() => setFeedback(null)}
        >
          <Alert severity={feedback.type}>{feedback.msg}</Alert>
        </Snackbar>
      )}
    </ProtectedRoute>
  );
}
