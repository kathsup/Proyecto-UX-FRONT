"use client";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DRAWER_WIDTH = 220;

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Estadísticas", href: "/stats" },
  { label: "Notas", href: "/notes" },
  { label: "Mis hábitos", href: "/habits" },
];

export default function Sidebar({
  onCreateClick,
}: {
  onCreateClick: () => void;
}) {
  const pathname = usePathname();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
      }}
    >
      <List sx={{ mt: 2 }}>
        <ListItemButton onClick={onCreateClick}>
          <ListItemText primary="+" />
        </ListItemButton>
        {navItems.map((item) => (
          <ListItemButton
            key={item.href}
            component={Link}
            href={item.href}
            selected={pathname === item.href}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box
        sx={{ mt: "auto", mb: 2, display: "flex", justifyContent: "center" }}
      >
        <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
      </Box>
    </Drawer>
  );
}
