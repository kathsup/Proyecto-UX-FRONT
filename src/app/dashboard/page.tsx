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
import { useAuth } from "../context/AuthContext";
import { getHabits, deleteHabit } from "../services/habits.service";
import { getRecords, upsertRecord } from "../services/records.service";
import { toDayKey, toLocalDay } from "../lib/dates";
import type { Habit } from "../types/habits";
import type { HabitRecord } from "../types/records";

// Racha: días consecutivos (hasta hoy) con al menos un hábito completado
function calculateStreak(completedDays: Set<string>) {
  let streak = 0;
  const cursor = new Date();
  while (completedDays.has(toLocalDay(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [records, setRecords] = useState<HabitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const today = toLocalDay();

  async function loadData() {
    setLoading(true);
    try {
      const [habitsData, recordsData] = await Promise.all([
        getHabits(),
        getRecords(),
      ]);
      setHabits(habitsData);
      setRecords(recordsData);
    } catch {
      setFeedback({ type: "error", msg: "No se pudieron cargar los datos" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Hábitos activos que ya empezaron y no han terminado
  const activeHabits = habits.filter(
    (h) =>
      h.active &&
      toDayKey(h.startDate) <= today &&
      (!h.endDate || toDayKey(h.endDate) >= today),
  );

  const todayRecords = records.filter((r) => toDayKey(r.date) === today);
  const recordByHabit = new Map(todayRecords.map((r) => [r.habitId, r]));

  const completedTodayCount = activeHabits.filter(
    (h) => recordByHabit.get(h.id)?.completed,
  ).length;

  // % del día por cantidad (con capping): suma de min(value, meta) / suma de metas
  const totalTarget = activeHabits.reduce((sum, h) => sum + h.targetValue, 0);
  const totalAchieved = activeHabits.reduce(
    (sum, h) =>
      sum + Math.min(recordByHabit.get(h.id)?.value ?? 0, h.targetValue),
    0,
  );
  const percent =
    totalTarget > 0 ? Math.round((totalAchieved / totalTarget) * 100) : 0;

  const completedDays = new Set(
    records.filter((r) => r.completed).map((r) => toDayKey(r.date)),
  );
  const streak = calculateStreak(completedDays);

  async function handleChangeValue(habitId: string, newValue: number) {
    setSavingId(habitId);
    try {
      const saved = await upsertRecord(habitId, today, newValue);
      // Reemplaza (o agrega) solo ese record, sin recargar toda la pantalla
      setRecords((prev) => {
        const index = prev.findIndex((r) => r.id === saved.id);
        if (index === -1) return [...prev, saved];
        const copy = [...prev];
        copy[index] = saved;
        return copy;
      });
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

  const stats = [
    { label: "Hábitos activos", value: activeHabits.length },
    {
      label: "Completados hoy",
      value: `${completedTodayCount}/${activeHabits.length}`,
    },
    { label: "Racha actual", value: `${streak} día${streak === 1 ? "" : "s"}` },
    { label: "% Cumplimiento", value: `${percent}%` },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

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
          {activeHabits.length === 0
            ? "Crea tu primer hábito para empezar."
            : `Llevas ${completedTodayCount} de ${activeHabits.length} hábitos completados hoy.`}
        </Typography>
      </Paper>

      {/* Métricas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 6, sm: 3 }}>
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
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Hábitos de hoy: una sola tarjeta con las filas adentro */}
      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Hábitos de hoy
        </Typography>

        {activeHabits.length === 0 ? (
          <Typography color="text.secondary">
            No tienes hábitos activos para hoy.
          </Typography>
        ) : (
          activeHabits.map((habit, index) => (
            <Box key={habit.id}>
              {index > 0 && <Divider />}
              <HabitRow
                habit={habit}
                value={recordByHabit.get(habit.id)?.value ?? 0}
                saving={savingId === habit.id}
                onChange={(newValue) => handleChangeValue(habit.id, newValue)}
                onEdit={() => router.push(`/habits/${habit.id}/edit`)}
                onDelete={() => setHabitToDelete(habit.id)}
              />
            </Box>
          ))
        )}
      </Paper>

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
