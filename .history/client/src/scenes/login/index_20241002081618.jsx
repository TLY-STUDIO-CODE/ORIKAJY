import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginUser, reset } from "../../features/authSlice";
import { Box, Button, TextField, Typography, CircularProgress, useTheme, IconButton, InputAdornment } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { tokens } from "../../theme";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isError, isSuccess, isLoading, message } = useSelector(
        (state) => state.auth
    );
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [showPassword, setShowPassword] = useState(false); 

    useEffect(() => {
        if (user || isSuccess) {
            toast.success("L'authentification est validé  avec succès. Vous allez être rediriger vers le tableau de bord!", {
                autoClose: 10000, 
            });
            setTimeout(() => {
            if (user?.role === "admin") {
                navigate("/dashboard-admin");
            } else if (user?.role === "manager") {
                navigate("/dashboard-manager");
            } else if (user?.role === "user") {
                navigate("/dashboard-user");
            }
        }, 5000); // Temps d'attente avant la redirection
    }
    dispatch(reset());
}, [user, isSuccess, dispatch, navigate]);

    const Auth = (e) => {
        e.preventDefault();
        dispatch(LoginUser({ email, password }));
    }

    useEffect(() => {
        if (isError) {
            toast.error(message, {
                autoClose: 10000,
            });
        }
    }, [isError, message]);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bgcolor={colors.primary[500]} 
        >
            <Box display="flex" flexDirection="column" alignItems="center">
                {/* Ajout de la phrase animée */}
                <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    style={{ textAlign: 'center', marginBottom: '20px' }}
                >
                    <Typography variant="h1" color={colors.greenAccent[500]}>
                        Bienvenue sur ORI-KAJY
                    </Typography>
                    <Typography variant="h4" color={colors.grey[100]}>
                        C'est une application de caisse, de gestion et de comptablilité, intuitive, performante et sécurisée
                    </Typography>
                    <Typography variant="h6" color={colors.grey[100]}>
                        Si vous êtes envie d'en savoir plus sur cette application! Veuillez vous connectez!
                    </Typography>
                </motion.div>

                {/* Formulaire de connexion */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: '20px' }}
                >
                    <Box
                        p={4}
                        width={400}
                        bgcolor={colors.primary[400]}
                        boxShadow={3}
                        borderRadius={2}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                    >
                        <Typography variant="h4" mb={2} color={colors.greenAccent[500]}>
                            CONNECTEZ VOUS
                        </Typography>
                        <form onSubmit={Auth} style={{ width: '100%' }}>
                            <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        type="email"
                        variant="outlined"
                        color="secondary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Mot de Passe"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        color="secondary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClickShowPassword} edge="end">
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="secondary"
                        sx={{ marginTop: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : "Se Connecter"}
                    </Button>
                        </form>
                    </Box>
                </motion.div>
            </Box>
            <ToastContainer />
        </Box>
    );
};

export default Login;

