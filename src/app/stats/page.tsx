"use client";
import ProtectedRoute from "../components/ProtectedRoute";
import Typography from "@mui/material/Typography";

export default function StatsPage() {
  return (
    <ProtectedRoute>
      <Typography variant="h5">Estadísticas</Typography>
      {/* build out the real content here */}
    </ProtectedRoute>
  );
}
