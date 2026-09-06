"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import { getHabits, deleteHabit } from "../services/habits.service";
import {
  getRecords,
  createRecord,
  deleteRecord,
} from "../services/records.service";

function isToday(dateStr: string) {
  return new Date(dateStr).toDateString() === new Date().toDateString();
}

function calculateStreak(daysWithActivity: Set<string>) {
  let streak = 0;
  const cursor = new Date();
  while (daysWithActivity.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [habits, setHabits] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  async function loadData() {
    setLoading(true);
    const [habitsData, recordsData] = await Promise.all([
      getHabits(),
      getRecords(),
    ]);
    setHabits(habitsData);
    setRecords(recordsData);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const activeHabits = habits.filter((h) => h.active);
  const todayRecords = records.filter((r) => isToday(r.date));
  const completedTodayIds = new Set(todayRecords.map((r) => r.habitId));
  const completedTodayCount = activeHabits.filter((h) =>
    completedTodayIds.has(h.id),
  ).length;
  const percent =
    activeHabits.length > 0
      ? Math.round((completedTodayCount / activeHabits.length) * 100)
      : 0;
  const activityDays = new Set(
    records.map((r) => new Date(r.date).toDateString()),
  );
  const streak = calculateStreak(activityDays);

  async function handleToggleCheck(habitId: string) {
    const existing = todayRecords.find((r) => r.habitId === habitId);
    try {
      if (existing) {
        await deleteRecord(existing.id);
      } else {
        await createRecord(habitId, new Date().toISOString());
      }
      await loadData();
    } catch {
      setFeedback({ type: "error", msg: "No se pudo actualizar el hábito" });
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
      <Paper
        sx={{
          p: 3,
          mb: 3,
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <Typography variant="h5">¡Bienvenid@, {user?.name}!</Typography>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 6, sm: 3 }}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h4" fontWeight={700}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Hábitos de hoy
      </Typography>
      {activeHabits.length === 0 ? (
        <Typography color="text.secondary">
          No tienes hábitos activos todavía.
        </Typography>
      ) : (
        activeHabits.map((habit) => (
          <Paper
            key={habit.id}
            sx={{
              p: 1.5,
              mb: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Checkbox
                checked={completedTodayIds.has(habit.id)}
                onChange={() => handleToggleCheck(habit.id)}
              />
              <Typography>{habit.name}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                onClick={() => router.push(`/habits/${habit.id}/edit`)}
              >
                Editar
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => setHabitToDelete(habit.id)}
              >
                Eliminar
              </Button>
            </Stack>
          </Paper>
        ))
      )}

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

      <Snackbar
        open={!!feedback}
        autoHideDuration={3000}
        onClose={() => setFeedback(null)}
      >
        {feedback && <Alert severity={feedback.type}>{feedback.msg}</Alert>}
      </Snackbar>
    </ProtectedRoute>
  );
}
