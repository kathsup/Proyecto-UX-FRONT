/*import Card from "@mui/material/Card";
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
*/

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
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
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        opacity: habit.active ? 1 : 0.6,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
        >
          <Typography variant="h6" sx={{ pr: 1 }}>
            {habit.name}
          </Typography>
          <Switch
            size="small"
            checked={habit.active}
            onChange={(e) => onToggleActive(habit.id, e.target.checked)}
          />
        </Stack>

        {habit.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {habit.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          {habit.category && <Chip label={habit.category} size="small" />}
          <Chip label={frequencyText} size="small" variant="outlined" />
          <Chip
            label={`Meta: ${habit.targetValue} ${habit.unit ?? "veces"}`}
            size="small"
            variant="outlined"
          />
        </Stack>
      </CardContent>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          px: 1,
          pb: 1,
        }}
      >
        <Tooltip title="Editar">
          <IconButton
            size="small"
            color="primary"
            aria-label={`Editar ${habit.name}`}
            onClick={() => onEdit(habit.id)}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton
            size="small"
            color="error"
            aria-label={`Eliminar ${habit.name}`}
            onClick={() => onDelete(habit.id)}
          >
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
}
