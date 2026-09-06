import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

type Habit = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  frequency: string;
};

type Props = {
  habit: Habit;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function HabitCard({ habit, onEdit, onDelete }: Props) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{habit.name}</Typography>
        {habit.description && (
          <Typography variant="body2" color="text.secondary">
            {habit.description}
          </Typography>
        )}
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {habit.category && <Chip label={habit.category} size="small" />}
          <Chip label={habit.frequency} size="small" variant="outlined" />
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
