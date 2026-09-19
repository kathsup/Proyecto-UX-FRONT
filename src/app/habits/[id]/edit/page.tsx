"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { HabitForm } from "@/app/components/forms/habitForm";
import { getHabitById } from "@/app/services/habits.service";
import type { Habit } from "@/app/types/habits";

export default function EditHabitPage() {
  const { id } = useParams<{ id: string }>();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getHabitById(id)
      .then(setHabit)
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return <Alert severity="error">No se pudo cargar el hábito.</Alert>;
  }

  if (!habit) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ProtectedRoute>
      <HabitForm
        habitId={id}
        initialValues={{
          name: habit.name,
          description: habit.description ?? "",
          category: habit.category ?? "",
          frequency: habit.frequency,
          targetValue: String(habit.targetValue),
          unit: habit.unit ?? "veces",
          periodDays: habit.periodDays ? String(habit.periodDays) : "",
          priority: habit.priority ?? "",
          startDate: habit.startDate,
          endDate: habit.endDate ?? "",
        }}
      />
    </ProtectedRoute>
  );
}
