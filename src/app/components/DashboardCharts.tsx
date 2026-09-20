"use client";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import type { DayPercent } from "../types/statistics";

type Props = {
  weekly: DayPercent[];
  monthly: DayPercent[];
};

const formatPercent = (value: number | null) =>
  value === null ? "Sin datos" : `${value}%`;

const weekdayLabel = (day: string) =>
  new Date(`${day}T12:00:00`).toLocaleDateString("es", { weekday: "short" });

export default function DashboardCharts({ weekly, monthly }: Props) {
  const theme = useTheme();
  const color = theme.palette.primary.main;

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, md: 5 }}>
        <Paper sx={{ p: 2.5 }}>
          <Typography variant="h6">Cumplimiento semanal</Typography>
          <BarChart
            height={260}
            hideLegend
            borderRadius={8}
            xAxis={[
              {
                scaleType: "band",
                data: weekly.map((d) => weekdayLabel(d.day)),
              },
            ]}
            yAxis={[{ min: 0, max: 100 }]}
            series={[
              {
                data: weekly.map((d) => d.percent),
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
          <Typography variant="h6">Cumplimiento del mes</Typography>
          <LineChart
            height={260}
            hideLegend
            xAxis={[
              {
                scaleType: "point",
                data: monthly.map((d) => Number(d.day.slice(8))),
              },
            ]}
            yAxis={[{ min: 0, max: 100 }]}
            series={[
              {
                data: monthly.map((d) => d.percent),
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
