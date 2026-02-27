import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
} from "@mui/material";

import Sales from "./pages/Sales";
import Products from "./pages/Products";
import Salespersons from "./pages/SalesPersons";
import Customers from "./pages/Customers";
import Reports from "./pages/Report";

const drawerWidth = 240;

const navItems = [
  { label: "Sales", path: "/sales" },
  { label: "Products", path: "/products" },
  { label: "Sales Persons", path: "/salespersons" },
  { label: "Customers", path: "/customers" },
  { label: "Reports", path: "/reports" },
];

const App = () => {
  return (
    <BrowserRouter>
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap>
              BeSpoked Bikes Sales Tracker
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  "&.active": {
                    bgcolor: "action.selected",
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Routes>
            <Route path="/sales" element={<Sales />} />
            <Route path="/products" element={<Products />} />
            <Route path="/salespersons" element={<Salespersons />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Sales />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
};

export default App;
