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
            toast.success("Validation de l'authentification avec succès, vous allez être redirigé vers le tableau de bord!", {
                autoClose: 10000, 
            });
            setTimeout(() => {
                navigate("/dashboard");
            }, 5000); 
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
                        Bienvenu sur la page de connexion de l'application ORI-KAJY
                    </Typography>
                    <Typography variant="h4" color={colors.grey[100]}>
                        C'est une application de caisse, de gestion et de comptablilité, intuitive, performante et sécurisée
                    </Typography>
                    <Typography variant="h6" color={colors.grey[100]}>
                        C'est une application de caisse, de gestion et de comptablilité, intuitive, performante et sécurisée
                    </Typography>
                </motion.div>

                {/* Formulaire de connexion */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box
                        p={4}
                        width={350}
                        bgcolor={colors.primary[400]}
                        boxShadow={3}
                        borderRadius={2}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                    >
                        <Typography variant="h4" mb={2} color={colors.greenAccent[500]}>
                            CONNEXION
                        </Typography>
                        <form onSubmit={Auth} style={{ width: '100%' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="email"
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                required
                                sx={{
                                    input: { color: colors.grey[100] },
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                type={showPassword ? "text" : "password"}
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                required
                                sx={{
                                    input: { color: colors.grey[100] },
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Box mt={3}>
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    fullWidth
                                    disabled={isLoading}
                                    sx={{
                                        backgroundColor: colors.greenAccent[700],
                                        color: colors.grey[100],
                                    }}
                                >
                                    {isLoading ? <CircularProgress size={24} /> : 'Se connecter'}
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </motion.div>
            </Box>
            <ToastContainer />
        </Box>
    );
};

export default Login;

