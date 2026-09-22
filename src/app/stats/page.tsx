"use client";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ProtectedRoute from "../components/ProtectedRoute";
import StatisticsCharts from "../components/StatisticsCharts";
import HeatmapCalendar from "../components/HeatmapCalendar";
import { getOverview, getHeatmap } from "../services/statistics.service";
import { toLocalDay } from "../lib/dates";
import type { OverviewData, HeatmapDay } from "../types/statistics";

export default function EstadisticasPage() {
  const [tab, setTab] = useState<"resumen" | "historial">("resumen");
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [heatmapDays, setHeatmapDays] = useState<HeatmapDay[]>([]);
  const [days, setDays] = useState(90);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOverview(toLocalDay())
      .then(setOverview)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getHeatmap(days).then(setHeatmapDays);
  }, [days]);

  if (loading || !overview) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const cards = [
    { label: "Total de hábitos", value: overview.totalHabits },
    { label: "Hábitos activos", value: overview.activeHabits },
    { label: "Hábitos finalizados", value: overview.finishedHabits },
    {
      label: "Días consecutivos",
      value: `${overview.consecutiveDays} día${overview.consecutiveDays === 1 ? "" : "s"}`,
    },
  ];

  return (
    <ProtectedRoute>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Estadísticas
      </Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Resumen" value="resumen" />
        <Tab label="Historial" value="historial" />
      </Tabs>

      {tab === "resumen" && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {cards.map((card) => (
              <Grid key={card.label} size={{ xs: 6, sm: 3 }}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    background:
                      "linear-gradient(135deg, #EDE7FF 0%, #FFFFFF 100%)",
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

          <StatisticsCharts
            monthlyProgress={overview.monthlyProgress}
            trend={overview.trend}
            trendChange={overview.trendChange}
          />
        </>
      )}

      {tab === "historial" && (
        <Paper sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              mb: 2,
            }}
          >
            <Typography variant="h6">Últimos días</Typography>
            <ToggleButtonGroup
              size="small"
              value={days}
              exclusive
              onChange={(_, value) => value && setDays(value)}
            >
              <ToggleButton value={30}>30 días</ToggleButton>
              <ToggleButton value={90}>90 días</ToggleButton>
              <ToggleButton value={180}>180 días</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {heatmapDays.length === 0 ? (
            <Typography color="text.secondary">Cargando...</Typography>
          ) : (
            <HeatmapCalendar days={heatmapDays} />
          )}
        </Paper>
      )}
    </ProtectedRoute>
  );
}
