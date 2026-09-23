import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { frequencyLabels } from "@/app/lib/habitOptions";
import type { Habit } from "@/app/types/habits";

type Props = {
  habit: Habit;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
};

export default function HabitCard({
  habit,
  onEdit,
  onDelete,
  onToggleActive,
}: Props) {
  const frequencyText =
    habit.frequency === "custom" && habit.periodDays
      ? `Cada ${habit.periodDays} días`
      : (frequencyLabels[habit.frequency] ?? habit.frequency);

  return (
    <Card sx={{ mb: 2, opacity: habit.active ? 1 : 0.6 }}>
      <CardContent>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
        >
          <Typography variant="h6">{habit.name}</Typography>
          <FormControlLabel
            sx={{ m: 0 }}
            control={
              <Switch
                checked={habit.active}
                onChange={(e) => onToggleActive(habit.id, e.target.checked)}
              />
            }
            label={habit.active ? "Activo" : "Inactivo"}
            labelPlacement="start"
          />
        </Stack>
        {habit.description && (
          <Typography variant="body2" color="text.secondary">
            {habit.description}
          </Typography>
        )}
        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}
        >
          {habit.category && <Chip label={habit.category} size="small" />}
          <Chip label={frequencyText} size="small" variant="outlined" />
          <Chip
            label={`Meta: ${habit.targetValue} ${habit.unit ?? "veces"}`}
            size="small"
            variant="outlined"
          />
        </Stack>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onEdit(habit.id)}>
          Editar
        </Button>
        <Button size="small" color="error" onClick={() => onDelete(habit.id)}>
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
}
