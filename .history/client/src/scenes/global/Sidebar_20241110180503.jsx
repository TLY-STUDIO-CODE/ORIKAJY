import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useNavigate, useLocation  } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useSelector } from 'react-redux';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';
import PolylineOutlinedIcon from '@mui/icons-material/PolylineOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import BubbleChartOutlinedIcon from '@mui/icons-material/BubbleChartOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import TokenOutlinedIcon from '@mui/icons-material/TokenOutlined';
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
const theme = useTheme();
const colors = tokens(theme.palette.mode);
const [isCollapsed, setIsCollapsed] = useState(false);
const [selected, setSelected] = useState("Dashboard");
const { user } = useSelector((state) => state.auth);
const navigate = useNavigate();
const location = useLocation(); // Ajout de useLocation pour vérifier la route actuelle

  // Use effect to handle role-based redirection only on dashboard page
  useEffect(() => {
    if (user && location.pathname === '/dashboard') { // Rediriger uniquement si l'utilisateur est sur "/dashboard"
      if (user.role === 'admin') {
        navigate('/dashboard-admin');
      } else if (user.role === 'manager') {
        navigate('/dashboard-manager');
      } else if (user.role === 'user') {
        navigate('/dashboard-user');
      }
    }
  }, [user, navigate, location.pathname]);


  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                ORI-KAJY
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt=""
                  width="100px"
                  height="100px"
                  src={user && user.image ? `http://localhost:5000${user.image}` : ``}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user && user.name}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {user && user.role}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="Tableau de bord"
                to="/dashboard"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            {user && user.role === "admin" && (
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Membre
            </Typography>
            )}
            {/* User Dropdown */}
            {user && user.role === "admin" && (
              <SubMenu
                title="Utilisateur"
                icon={<PermIdentityOutlinedIcon />}
                style={{ color: colors.grey[100] }}
              >
                <Item
                  title="Utilisateurs"
                  to="/users"
                  icon={<GroupsOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Nouvel utilisateur"
                  to="/users/add"
                  icon={<PersonAddOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </SubMenu>
            )}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Gestion
            </Typography>
            {/* Product Management Dropdown */}
              <SubMenu
                title="Produit"
                icon={<CategoryOutlinedIcon />}
                style={{ color: colors.grey[100] }}
              >
                <Item
                  title="Produits"
                  to="/products"
                  icon={<ShoppingCartCheckoutOutlinedIcon  />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </SubMenu>

            {/* Stock Management Dropdown */}
              <SubMenu
                title="Stock"
                icon={<Inventory2OutlinedIcon />}
                style={{ color: colors.grey[100] }}
              >
                <Item
                  title="Stocks"
                  to="/stocks"
                  icon={<ShoppingCartCheckoutOutlinedIcon  />}
                  selected={selected}
                  setSelected={setSelected}
                />
                {user && user.role !== "manager" && (
                <Item
                  title="Nouvel stock"
                  to="/stocks/add"
                  icon={<AddShoppingCartOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                )}
              </SubMenu>
              {user && user.role !== "manager" && (
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Encaissement
              </Typography>
            )}            
            {/* Caisse Management Dropdown */}
            {user && user.role !== "manager" && (
              <SubMenu
                title="Caisse"
                icon={<PointOfSaleOutlinedIcon />}
                style={{ color: colors.grey[100] }}
              >
                <SubMenu
                  title="Achat"
                  icon={<ShoppingCartOutlinedIcon />}
                  style={{ color: colors.grey[100] }}
                >
                  <Item
                    title="Achats"
                    to="/achats"
                    icon={<ShoppingCartCheckoutOutlinedIcon  />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Nouvel achat"
                    to="/achats/add"
                    icon={<AddShoppingCartOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </SubMenu>
                <SubMenu
                  title="Vente"
                  icon={<ShoppingBagOutlinedIcon />}
                  style={{ color: colors.grey[100] }}
                >
                  <Item
                    title="Ventes"
                    to="/ventes2"
                    icon={<ShoppingCartCheckoutOutlinedIcon  />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Nouvelle vente"
                    to="/ventes2/add"
                    icon={<AddShoppingCartOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </SubMenu>
                <SubMenu
                title="Commande"
                icon={<ShoppingBasketOutlinedIcon/>}
                style={{ color: colors.grey[100] }}
              >
                <Item
                  title="Commandes"
                  to="/commandes"
                  icon={<ShoppingCartCheckoutOutlinedIcon    />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Nouvelle commande"
                  to="/commandes/add"
                  icon={<AddShoppingCartOutlinedIcon  />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </SubMenu>
              </SubMenu>
            )}
            {user && user.role !== "user" && (
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Comptabilité
            </Typography>
            )}
            {/* User Dropdown */}
            {user && user.role !== "user" && (
              <SubMenu
                title="Comptables"
                icon={<PolylineOutlinedIcon />}
                style={{ color: colors.grey[100] }}
              >
              {user && user.role === "admin" && (
                <SubMenu
                title="Ecriture"
                icon={<ModeOutlinedIcon  />}
                style={{ color: colors.grey[100] }}
              >
                <Item
                  title="Ecritures"
                  to="/accounting-entries"
                  icon={<AssignmentTurnedInOutlinedIcon  />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Nouvelle écriture"
                  to="/accounting-entries/add"
                  icon={<NoteAltOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </SubMenu>
              )}
                {user && user.role === "admin" && (
                <SubMenu
                title=" Journal"
                icon={<ReceiptLongOutlinedIcon  />}
                style={{ color: colors.grey[100] }}
              >
                <Item
                  title="Journals"
                  to="/journals"
                  icon={<AssignmentTurnedInOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Nouveau journal"
                  to="/journals/add"
                  icon={<NoteAltOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Assigner journal"
                  to="/journals/assign"
                  icon={<LocalOfferOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                </SubMenu>
                )}
                {user && user.role === "admin" && (
                <SubMenu
                title="Plan"
                icon={<BubbleChartOutlinedIcon   />}
                style={{ color: colors.grey[100] }}
                >
                <Item
                  title="Comptes"
                  to="/plans"
                  icon={<AssignmentTurnedInOutlinedIcon  />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Nouveau compte"
                  to="/plans/add"
                  icon={<NoteAltOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Nouveau solde"
                  to="/balances/add"
                  icon={<SavingsOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                </SubMenu>
                )}
                <SubMenu
                title="Rapport"
                icon={<AccountBalanceOutlinedIcon   />}
                style={{ color: colors.grey[100] }}
                >
                <Item
                  title="Financiers"
                  to="/revenues"
                  icon={<BalanceOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Secteur F"
                  to="/pie"
                  icon={<PieChartOutlineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Linéaire T"
                  to="/line2"
                  icon={<TimelineOutlinedIcon  />}
                  selected={selected}
                  setSelected={setSelected}
                />
                </SubMenu>
              </SubMenu>
            )}
            {user && user.role !== "user" && (
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Bilan
            </Typography>
            )}
             {/* Stock Management Dropdown */}
            {user && user.role !== "user" && (
              <SubMenu
                title="Rapport"
                icon={<AssignmentOutlinedIcon />}
                style={{ color: colors.grey[100] }}
              >
                <Item
                title="Transactions"
                to="/transactions"
                icon={<SwapHorizOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              </SubMenu>
            )}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Emploi du temps
            </Typography>
            {/* Agenda Dropdown */}
            <SubMenu
              title="Agenda"
              icon={<CalendarTodayOutlinedIcon />}
              style={{ color: colors.grey[100] }}
            >
              <Item
                title="Calendrier"
                to="/calendar"
                icon={<CalendarMonthOutlinedIcon  />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Événements"
                to="/calendarList"
                icon={<EventNoteOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>
            {user && user.role === "admin" && (
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Surveillance
            </Typography>
            )}
            {user && user.role === "admin" && (
            
            <Item
              title="Audit"
              to="/audits"
              icon={<TokenOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
