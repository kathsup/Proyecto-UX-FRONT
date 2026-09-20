"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ProtectedRoute from "../components/ProtectedRoute";
import HabitRow from "../components/HabitRow";
import DashboardCharts from "../components/DashboardCharts";
import { useAuth } from "../context/AuthContext";
import { deleteHabit } from "../services/habits.service";
import { getMatrix, upsertRecord } from "../services/records.service";
import { getDashboard } from "../services/statistics.service";
import { toLocalDay } from "../lib/dates";
import type { MatrixHabit } from "../types/records";
import type { DashboardData } from "../types/statistics";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [habits, setHabits] = useState<MatrixHabit[]>([]);
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const today = toLocalDay();

  // Carga inicial: cifras del dashboard + hábitos de hoy con su valor
  async function loadData() {
    setLoading(true);
    try {
      const [dashboard, matrix] = await Promise.all([
        getDashboard(today),
        getMatrix(today, today),
      ]);
      setStats(dashboard);
      setHabits(matrix.habits.filter((h) => h.active));
    } catch {
      setFeedback({ type: "error", msg: "No se pudieron cargar los datos" });
    } finally {
      setLoading(false);
    }
  }

  // Refresca solo las cifras, sin spinner
  async function refreshStats() {
    try {
      setStats(await getDashboard(today));
    } catch {
      setFeedback({
        type: "error",
        msg: "No se pudieron actualizar las cifras",
      });
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleChangeValue(habitId: string, newValue: number) {
    setSavingId(habitId);
    try {
      const saved = await upsertRecord(habitId, today, newValue);
      // Actualiza solo la celda de hoy de ese hábito
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitId
            ? {
                ...h,
                cells: {
                  ...h.cells,
                  [today]: { value: saved.value, completed: saved.completed },
                },
              }
            : h,
        ),
      );
      await refreshStats();
    } catch {
      setFeedback({ type: "error", msg: "No se pudo actualizar el hábito" });
    } finally {
      setSavingId(null);
    }
  }

  async function confirmDeleteHabit() {
    if (!habitToDelete) return;
    try {
      await deleteHabit(habitToDelete);
      setFeedback({ type: "success", msg: "Hábito eliminado" });
      await loadData();
    } catch {
      setFeedback({ type: "error", msg: "No se pudo eliminar el hábito" });
    } finally {
      setHabitToDelete(null);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        No se pudo cargar el dashboard. Intenta recargar la página.
      </Typography>
    );
  }

  const cards = [
    { label: "Hábitos activos", value: stats.activeHabits },
    {
      label: "Completados hoy",
      value: `${stats.completedToday}/${stats.activeHabits}`,
    },
    {
      label: "Racha actual",
      value: `${stats.currentStreak} día${stats.currentStreak === 1 ? "" : "s"}`,
    },
    {
      label: "Mejor racha",
      value: `${stats.bestStreak} día${stats.bestStreak === 1 ? "" : "s"}`,
    },
    { label: "% Cumplimiento", value: `${stats.percentToday ?? 0}%` },
  ];

  return (
    <ProtectedRoute>
      {/* Banner de bienvenida con degradado */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          color: "primary.contrastText",
          background:
            "linear-gradient(135deg, #5B3FD6 0%, #7C5CFA 55%, #A78BFA 100%)",
          border: "none",
        }}
      >
        <Typography variant="h5">¡Bienvenid@, {user?.firstName}!</Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
          {stats.activeHabits === 0
            ? "Crea tu primer hábito para empezar."
            : `Llevas ${stats.completedToday} de ${stats.activeHabits} hábitos completados hoy.`}
        </Typography>
      </Paper>

      {/* Métricas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {cards.map((card) => (
          <Grid key={card.label} size={{ xs: 6, sm: 4, md: 2.4 }}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                background: "linear-gradient(135deg, #EDE7FF 0%, #FFFFFF 100%)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": { transform: "translateY(-3px)" },
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "primary.dark" }}
              >
                {card.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Hábitos de hoy */}
      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Hábitos de hoy
        </Typography>

        {habits.length === 0 ? (
          <Typography color="text.secondary">
            No tienes hábitos activos para hoy.
          </Typography>
        ) : (
          habits.map((habit, index) => (
            <Box key={habit.id}>
              {index > 0 && <Divider />}
              <HabitRow
                habit={habit}
                value={habit.cells[today]?.value ?? 0}
                saving={savingId === habit.id}
                onChange={(newValue) => handleChangeValue(habit.id, newValue)}
                onEdit={() => router.push(`/habits/${habit.id}/edit`)}
                onDelete={() => setHabitToDelete(habit.id)}
              />
            </Box>
          ))
        )}
      </Paper>

      {/* Gráficas */}
      <DashboardCharts weekly={stats.weekly} monthly={stats.monthly} />

      <Dialog open={!!habitToDelete} onClose={() => setHabitToDelete(null)}>
        <DialogTitle>¿Eliminar este hábito?</DialogTitle>
        <DialogContent>Esta acción no se puede deshacer.</DialogContent>
        <DialogActions>
          <Button onClick={() => setHabitToDelete(null)}>Cancelar</Button>
          <Button color="error" onClick={confirmDeleteHabit}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {feedback && (
        <Snackbar
          open={Boolean(feedback)}
          autoHideDuration={3000}
          onClose={() => setFeedback(null)}
        >
          <Alert severity={feedback.type}>{feedback.msg}</Alert>
        </Snackbar>
      )}
    </ProtectedRoute>
  );
}
