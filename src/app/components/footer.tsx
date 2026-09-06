import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function Footer() {
  return (
    <Box component="footer" sx={{ textAlign: "center", py: 2 }}>
      <Typography variant="body2" color="text.secondary">
        © 2026 Habit Tracker
      </Typography>
    </Box>
  );
}
