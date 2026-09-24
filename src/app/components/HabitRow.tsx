"use client";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import HabitStepper from "./HabitStepper";
import type { Habit } from "../types/habits";

type Props = {
  habit: Pick<Habit, "id" | "name" | "targetValue" | "unit">;
  value: number;
  saving?: boolean;
  onChange: (newValue: number) => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function HabitRow({
  habit,
  value,
  saving,
  onChange,
  onEdit,
  onDelete,
}: Props) {
  const percent = Math.min(100, Math.round((value / habit.targetValue) * 100));
  const completed = value >= habit.targetValue;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 2,
        py: 2,
      }}
    >
      {/* Nombre */}
      <Typography sx={{ fontWeight: 600, flex: "1 1 140px", minWidth: 120 }}>
        {habit.name}
      </Typography>

      {/* Stepper */}
      <HabitStepper
        habitName={habit.name}
        value={value}
        target={habit.targetValue}
        unit={habit.unit}
        disabled={saving}
        onChange={onChange}
      />

      {/* Barra con el % arriba */}
      <Box sx={{ flex: "2 1 180px", minWidth: 160 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", textAlign: "center", mb: 0.5 }}
        >
          {percent}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={percent}
          color={completed ? "success" : "primary"}
          aria-label={`Progreso de ${habit.name}`}
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>

      {/* Acciones */}
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <Tooltip title="Editar">
          <IconButton
            aria-label={`Editar ${habit.name}`}
            onClick={onEdit}
            color="primary"
          >
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton
            aria-label={`Eliminar ${habit.name}`}
            onClick={onDelete}
            color="error"
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
