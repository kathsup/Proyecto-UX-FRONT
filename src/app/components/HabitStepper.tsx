"use client";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

type Props = {
  habitName: string;
  value: number;
  target: number;
  unit?: string | null;
  disabled?: boolean;
  onChange: (newValue: number) => void;
};

const buttonSx = {
  bgcolor: "action.hover",
  borderRadius: 2,
  width: 32,
  height: 32,
};

export default function HabitStepper({
  habitName,
  value,
  target,
  unit,
  disabled,
  onChange,
}: Props) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <IconButton
          aria-label={`Restar uno a ${habitName}`}
          disabled={disabled || value <= 0}
          onClick={() => onChange(value - 1)}
          sx={buttonSx}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>

        <Typography sx={{ minWidth: 28, textAlign: "center", fontWeight: 700 }}>
          {value}
        </Typography>

        <IconButton
          aria-label={`Sumar uno a ${habitName}`}
          disabled={disabled}
          onClick={() => onChange(value + 1)}
          sx={buttonSx}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Typography variant="caption" color="text.secondary">
        {value}/{target} {unit ?? "veces"}
      </Typography>
    </Box>
  );
}
