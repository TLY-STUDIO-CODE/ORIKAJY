import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
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

// Mock function to get the user's role (Replace this with your actual role management logic)
const getUserRole = () => {
  // This is where you get the user's role (e.g., from context, state, or API)
  // Return 'manager', 'user', or other roles
  return 'manager'; // Example, change this accordingly
};

// Protect routes based on the role
const ProtectedRoute = ({ element, allowedRoles }) => {
  const role = getUserRole();
  return allowedRoles.includes(role) ? <Navigate to="/dashboard" /> : element;
};

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

              {/* Block routes for 'manager' */}
              <Route path="/products" element={<ProtectedRoute element={<Products />} allowedRoles={['manager']} />} />
              <Route path="/products/edit/:id" element={<ProtectedRoute element={<EditProduct />} allowedRoles={['manager']} />} />
              <Route path="/stocks" element={<ProtectedRoute element={<Stocks />} allowedRoles={['manager']} />} />
              <Route path="/stocks/add" element={<ProtectedRoute element={<AddStock />} allowedRoles={['manager']} />} />
              <Route path="/stocks/edit/:id" element={<ProtectedRoute element={<EditStock />} allowedRoles={['manager']} />} />
              <Route path="/achats" element={<ProtectedRoute element={<Achats />} allowedRoles={['manager']} />} />
              <Route path="/achats/add" element={<ProtectedRoute element={<AddAchat />} allowedRoles={['manager']} />} />
              <Route path="/achats/edit/:id" element={<ProtectedRoute element={<EditAchat />} allowedRoles={['manager']} />} />
              <Route path="/commandes" element={<ProtectedRoute element={<Commandes />} allowedRoles={['manager']} />} />
              <Route path="/commandes/add" element={<ProtectedRoute element={<AddCommande />} allowedRoles={['manager']} />} />
              <Route path="/commandes/edit/:id" element={<ProtectedRoute element={<EditCommande />} allowedRoles={['manager']} />} />
              <Route path="/ventes2" element={<ProtectedRoute element={<Ventes2 />} allowedRoles={['manager']} />} />
              <Route path="/ventes2/add" element={<ProtectedRoute element={<AddVente2 />} allowedRoles={['manager']} />} />

              {/* Block routes for 'user' */}
              <Route path="/revenues" element={<ProtectedRoute element={<Revenues />} allowedRoles={['user']} />} />
              <Route path="/transactions" element={<ProtectedRoute element={<Transactions />} allowedRoles={['user']} />} />

              {/* Block routes for both 'manager' and 'user' */}
              <Route path="/users" element={<ProtectedRoute element={<Users />} allowedRoles={['manager', 'user']} />} />
              <Route path="/users/add" element={<ProtectedRoute element={<AddUser />} allowedRoles={['manager', 'user']} />} />
              <Route path="/users/edit/:id" element={<ProtectedRoute element={<EditUser />} allowedRoles={['manager', 'user']} />} />

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
