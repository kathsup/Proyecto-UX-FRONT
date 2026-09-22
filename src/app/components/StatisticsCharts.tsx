"use client";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import type { MonthPercent, WeekPercent } from "../types/statistics";

type Props = {
  monthlyProgress: MonthPercent[];
  trend: WeekPercent[];
  trendChange: number | null;
};

const formatPercent = (value: number | null) =>
  value === null ? "Sin datos" : `${value}%`;

// "2026-09" -> "sep"
const monthLabel = (month: string) =>
  new Date(`${month}-01T12:00:00`).toLocaleDateString("es", { month: "short" });

export default function StatisticsCharts({
  monthlyProgress,
  trend,
  trendChange,
}: Props) {
  const theme = useTheme();
  const color = theme.palette.primary.main;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 5 }}>
        <Paper sx={{ p: 2.5 }}>
          <Typography variant="h6">Progreso mensual</Typography>
          <BarChart
            height={260}
            hideLegend
            borderRadius={8}
            xAxis={[
              {
                scaleType: "band",
                data: monthlyProgress.map((m) => monthLabel(m.month)),
              },
            ]}
            yAxis={[{ min: 0, max: 100 }]}
            series={[
              {
                data: monthlyProgress.map((m) => m.percent),
                label: "Cumplimiento",
                color,
                valueFormatter: formatPercent,
              },
            ]}
          />
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <Paper sx={{ p: 2.5 }}>
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography variant="h6">Tendencia de cumplimiento</Typography>
            {trendChange !== null && (
              <Chip
                size="small"
                color={trendChange >= 0 ? "success" : "error"}
                label={`${trendChange >= 0 ? "+" : ""}${trendChange} pts`}
              />
            )}
          </Stack>
          <LineChart
            height={260}
            hideLegend
            xAxis={[
              {
                scaleType: "point",
                data: trend.map((_, i) => i + 1),
              },
            ]}
            yAxis={[{ min: 0, max: 100 }]}
            series={[
              {
                data: trend.map((w) => w.percent),
                label: "Cumplimiento",
                color,
                area: true,
                showMark: false,
                curve: "monotoneX",
                valueFormatter: formatPercent,
              },
            ]}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
