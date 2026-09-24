/*"use client";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import ProtectedRoute from "../components/ProtectedRoute";
import { getMe } from "../services/users.service";
import type { Me } from "../types/user";

export default function PerfilPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(setMe)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!me) {
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        No se pudo cargar el perfil.
      </Typography>
    );
  }

  return (
    <ProtectedRoute>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Perfil
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 480 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56 }}>
            {me.firstName[0]}
            {me.lastName[0]}
          </Avatar>
          <Box>
            <Typography variant="h6">
              {me.firstName} {me.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {me.email}
            </Typography>
          </Box>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Miembro desde{" "}
          {new Date(me.createdAt).toLocaleDateString("es", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Typography>
      </Paper>
    </ProtectedRoute>
  );
}*/

"use client";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import ProtectedRoute from "../components/ProtectedRoute";
import { getMe } from "../services/users.service";
import { getOverview } from "../services/statistics.service";
import { toLocalDay } from "../lib/dates";
import type { Me } from "../types/user";
import type { OverviewData } from "../types/statistics";

export default function PerfilPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMe(), getOverview(toLocalDay())])
      .then(([meData, overviewData]) => {
        setMe(meData);
        setOverview(overviewData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!me) {
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        No se pudo cargar el perfil.
      </Typography>
    );
  }

  const stats = overview
    ? [
        { label: "Total de hábitos", value: overview.totalHabits },
        { label: "Hábitos activos", value: overview.activeHabits },
        {
          label: "Días consecutivos",
          value: `${overview.consecutiveDays} día${overview.consecutiveDays === 1 ? "" : "s"}`,
        },
      ]
    : [];

  return (
    <ProtectedRoute>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Perfil
      </Typography>

      <Paper sx={{ p: 3, mb: 3, maxWidth: 640 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              fontSize: 28,
              bgcolor: "primary.main",
            }}
          >
            {me.firstName[0]}
            {me.lastName[0]}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {me.firstName} {me.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {me.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Miembro desde{" "}
              {new Date(me.createdAt).toLocaleDateString("es", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {overview && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tu actividad
          </Typography>
          <Grid container spacing={2}>
            {stats.map((stat) => (
              <Grid key={stat.label} size={{ xs: 6, sm: 3 }}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    background:
                      "linear-gradient(135deg, #EDE7FF 0%, #FFFFFF 100%)",
                  }}
                >
                  <Typography
                    variant="h5"
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
        </>
      )}
    </ProtectedRoute>
  );
}
