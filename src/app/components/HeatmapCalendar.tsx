"use client";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { alpha, useTheme } from "@mui/material/styles";
import type { HeatmapDay } from "../types/statistics";

type Props = { days: HeatmapDay[] };

export default function HeatmapCalendar({ days }: Props) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 0.75,
      }}
    >
      {days.map(({ day, done }) => (
        <Tooltip
          key={day}
          title={`${day} · ${done ? "Completado" : "No completado"}`}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: 0.75,
              bgcolor: done
                ? "primary.main"
                : alpha(theme.palette.primary.main, 0.1),
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
}
