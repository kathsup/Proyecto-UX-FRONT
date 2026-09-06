"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ProtectedRoute from "../components/ProtectedRoute";
import HabitCard from "../components/habits/card";
import { getHabits, deleteHabit } from "../services/habits.service";

export default function HabitsPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  async function loadHabits() {
    setLoading(true);
    const data = await getHabits();
    setHabits(data);
    setLoading(false);
  }

  useEffect(() => {
    loadHabits();
  }, []);

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

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : habits.length === 0 ? (
        <Typography color="text.secondary">
          Aún no tienes hábitos. Crea uno con el botón +.
        </Typography>
      ) : (
        habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onEdit={(id) => router.push(`/habits/${id}/edit`)}
            onDelete={(id) => setHabitToDelete(id)}
          />
        ))
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
