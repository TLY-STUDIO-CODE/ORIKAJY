import React, { useState, useEffect, useContext } from "react";
import { Box, IconButton, useTheme, Badge, Menu, MenuItem, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, reset } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css';
import './Topbar.css'; // Import CSS file for animatio
const socket = io('http://localhost:5000'); // Ensure the server port is correct

const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [lowStockCount, setLowStockCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Écoute pour les notifications de stock faible
    const handleStockNotification = (data) => {
        // Ajoute la notification à l'état
        setNotifications((prev) => [...prev, data]);
        setLowStockCount((prev) => prev + 1); // Augmente le nombre de notifications

        // Affiche une notification toast pour le stock faible
        const toastId = toast.info(`Niveu de stock du produit  ${data.productName}: est égale à ${data.stockLevel} !`, {
            position: "top-right",
            autoClose: 1000000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onClose: () => {
                // Supprime la notification de l'état lorsque le toast est fermé
                setNotifications((prev) => prev.filter(notification => notification.productName !== data.productName));
                setLowStockCount((prev) => Math.max(prev - 1, 0)); // Décrémente le nombre de notifications
            }
        });

        // Supprime la notification après un certain temps si elle n'a pas été fermée manuellement
        setTimeout(() => {
            toast.dismiss(toastId);
            setNotifications((prev) => prev.filter(notification => notification.productName !== data.productName));
            setLowStockCount((prev) => Math.max(prev - 1, 0)); // Décrémente le nombre de notifications
        }, 1000000); // Délai de 10 secondes pour effacer la notification
    };

    socket.on('stock_notification', handleStockNotification);

    // Écoute pour la suppression des notifications (si stock > 20)
    socket.on('clear_notification', ({ name }) => {
        // Supprime la notification quand le stock est rétabli à un niveau supérieur à 20
        setNotifications((prev) => prev.filter(notification => notification.productName !== name));
        setLowStockCount((prev) => Math.max(prev - 1, 0)); // Décrémente le nombre de notifications
    });

    return () => {
        socket.off('stock_notification', handleStockNotification);
        socket.off('clear_notification');
    };
}, []);
   const handleNotificationItemClick = (message) => {
    // Afficher un toast quand une notification est cliquée
    toast.success(`Notification: ${message}`, {
        position: "top-right",
        autoClose: 10000, // Le toast s'affiche pendant 10 secondes
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        // Lorsque le toast disparaît, supprimer la notification
        onClose: () => {
            // Suppression de la notification côté client
            setNotifications((prev) => prev.filter(notif => notif !== message));
            setLowStockCount(prev => Math.max(prev - 1, 0)); // Mettre à jour le compteur de notifications

            // Émettre un événement pour informer le serveur que la notification doit être effacée
            socket.emit('clear_notification', { name: message.productName });
        }
    });

    handleClose(); // Fermer le menu des notifications après avoir cliqué
};



    const handleNotificationClick = (event) => {    
        setAnchorEl(event.currentTarget);
    };

    const handleSettingsClick = (event) => {
        setSettingsAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
        setSettingsAnchorEl(null);
    };

    const handleLogoutClick = () => {
        setOpenDialog(true);
    };

    const handleConfirmLogout = () => {
        dispatch(LogOut());
        dispatch(reset());
        navigate("/");
        setOpenDialog(false);
    };

    const handleCancelLogout = () => {
        setOpenDialog(false);
    };

    const handleAboutClick = () => {
        navigate("/about");
        handleClose();
    };

    const renderCell = (params) => (
        <Box display="flex" alignItems="center">
            <CircleIcon
                style={{
                    color: params.row.status === "connecté" ? "green" : "red",
                }}
            />
            <Typography sx={{ ml: 1 }}>
                {params.row.status === "connecté" ? "Connecté" : "Déconnecté"}
            </Typography>
        </Box>
    );

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            {/* User Status */}
            <Box display="flex" alignItems="center">
                {renderCell({ row: { status: user ? "connecté" : "déconnecté" } })}
            </Box>

            {/* Icons */}
            <Box display="flex">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                </IconButton>

                <>
            <IconButton onClick={handleNotificationClick}>
                <Badge badgeContent={lowStockCount} color="error">
                    <NotificationsOutlinedIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className="notification-menu"
                TransitionProps={{ timeout: { enter: 500, exit: 300 } }} // Adjust animation duration
            >
                <div className="notification-container">
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <MenuItem
                                key={index}
                                className="notification-item"
                                onClick={() => handleNotificationItemClick(notification.message)}
                            >
                                {notification.message}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem>Aucune nouvelle notification</MenuItem>
                    )}
                </div>
            </Menu>
        </>

                <IconButton onClick={handleSettingsClick}>
                    <SettingsOutlinedIcon />
                </IconButton>

                {/* Settings Dropdown Menu */}
                <Menu anchorEl={settingsAnchorEl} open={Boolean(settingsAnchorEl)} onClose={handleClose}>
                    <MenuItem onClick={handleLogoutClick}>
                        <LogoutOutlinedIcon sx={{ mr: 1 }} /> Déconnexion
                    </MenuItem>
                    <MenuItem onClick={colorMode.toggleColorMode}>
                        {theme.palette.mode === "dark" ? (
                            <>
                                <LightModeOutlinedIcon sx={{ mr: 1 }} /> Mode Éclairé
                            </>
                        ) : (
                            <>
                                <DarkModeOutlinedIcon sx={{ mr: 1 }} /> Mode Sombre
                            </>
                        )}
                    </MenuItem>
                </Menu>
            </Box>

            {/* Notifications Menu */}

 

            {/* Logout Confirmation Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCancelLogout}
                PaperProps={{ style: { backgroundColor: colors.background, color: colors.text } }}
            >
                <DialogTitle>Déconnexion</DialogTitle>
                <DialogContent>
                    <Typography>Voulez-vous vraiment vous déconnecter ?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelLogout} color="secondary">
                        Non
                    </Button>
                    <Button onClick={handleConfirmLogout} color="secondary">
                        Oui
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Toast notification container */}
            

        </Box>
    );
};

export default Topbar;
