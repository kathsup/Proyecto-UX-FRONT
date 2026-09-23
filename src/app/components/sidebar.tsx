"use client";
import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const DRAWER_WIDTH = 220;

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Estadísticas", href: "/stats" },
  { label: "Mis hábitos", href: "/habits" },
];

export default function Sidebar({
  onCreateClick,
}: {
  onCreateClick: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleLogout() {
    sessionStorage.removeItem("token");
    router.push("/login");
  }

  function goToProfile() {
    setAnchorEl(null);
    router.push("/perfil");
  }

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
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {user?.firstName?.[0] ?? "U"}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          {user && (
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          )}
          <Divider />

          <MenuItem onClick={goToProfile}>
            <ListItemIcon>
              <PersonOutlineIcon fontSize="small" />
            </ListItemIcon>
            Perfil
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Box>
    </Drawer>
  );
}
