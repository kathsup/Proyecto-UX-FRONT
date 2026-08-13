"use client";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ButtonGroup from "@mui/material/ButtonGroup";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const habitOptions = ["Beber agua", "Leer", "Meditar", "Hacer ejercicio"];

export default function Home() {
  return (
    <Autocomplete
      disablePortal
      options={habitOptions}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Hábito" />}
    />
  );
}
