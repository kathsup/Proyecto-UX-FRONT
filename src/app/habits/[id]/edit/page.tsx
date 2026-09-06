"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { HabitForm } from "@/app/components/forms/habitForm";
import { getHabitById } from "@/app/services/habits.service";

export default function EditHabitPage() {
  const { id } = useParams<{ id: string }>();
  const [habit, setHabit] = useState<any>(null);

  useEffect(() => {
    getHabitById(id).then(setHabit);
  }, [id]);

  if (!habit) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ProtectedRoute>
      <HabitForm habitId={id} initialValues={habit} />
    </ProtectedRoute>
  );
}
