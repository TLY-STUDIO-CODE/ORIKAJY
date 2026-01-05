import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Users from "./scenes/users";
import Login from "./scenes/login";
import Products from "./scenes/products";
import Achats from "./scenes/achats";
import Commandes from "./scenes/commandes";
import Revenues from "./scenes/revenues";
import Transactions from "./scenes/transactions";
import Stocks from "./scenes/stocks";
import AddStock from "./scenes/form_add_stocks";
import AddAchat from "./scenes/form_add_achats";
import AddCommande from "./scenes/form_add_commandes";
import AddVente2 from "./scenes/form_add_ventes2";
import Ventes2 from "./scenes/ventes2";
import EditAchat from "./scenes/form_edit_achats";
import EditCommande from "./scenes/form_edit_commandes";
import AddUser from "./scenes/form_add_users";
import EditUser from "./scenes/form_edit_users";
import EditStock from "./scenes/form_edit_stocks";
import EditProduct from "./scenes/form_edit_products";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import CalendarList from "./scenes/event_list/calendarList";



function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();

  // Check if the current path is the login page
  const isLoginPage = location.pathname === "/";

  return isLoginPage ? (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  ) : (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/add" element={<AddUser />} />
              <Route path="/users/edit/:id" element={<EditUser />}/>
              <Route path="/products" element={<Products />} />
              <Route path="/products/edit/:id" element={<EditProduct />}/>
              <Route path="/stocks" element={<Stocks />} />
              <Route path="/stocks/add" element={<AddStock />} />
              <Route path="/stocks/edit/:id" element={<EditStock />} />
              <Route path="/achats" element={<Achats />} />
              <Route path="/achats/add" element={<AddAchat />} />
              <Route path="/achats/edit/:id" element={<EditAchat />} />
              <Route path="/commandes" element={<Commandes />} />
              <Route path="/commandes/add" element={<AddCommande />} />
              <Route path="/commandes/edit/:id" element={<EditCommande />} />
              <Route path="/ventes2" element={<Ventes2 />} />
              <Route path="/ventes2/add" element={<AddVente2 />} />
              <Route path="/revenues" element={<Revenues />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/calendarList" element={<CalendarList />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
