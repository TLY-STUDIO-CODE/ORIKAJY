import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginUser, reset } from "../../features/authSlice";
import { Box, Button, TextField, Typography, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { Email, Lock } from '@mui/icons-material'; // Importation des icônes
import { useMode } from "../../theme";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);
    const [theme, colorMode] = useMode(); // Utiliser le mode sombre et vert

    useEffect(() => {
        if (user || isSuccess) {
            navigate("/dashboard");
        }
        dispatch(reset());
    }, [user, isSuccess, dispatch, navigate]);

    const Auth = (e) => {
        e.preventDefault();
        dispatch(LoginUser({ email, password }));
    };

    useEffect(() => {
        if (isError) {
            toast.error(message, {
                autoClose: 5000,
            });
        }
    }, [isError, message]);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bgcolor={theme.palette.background.default}
        >
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Box
                    p={4}
                    width={350}
                    bgcolor={theme.palette.background.paper}
                    boxShadow={3}
                    borderRadius={2}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <Typography variant="h4" mb={2} color="primary">
                        Connexion
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton edge="start">
                                            <Email />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            type="password"
                            label="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton edge="start">
                                            <Lock />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box mt={3}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Se connecter'}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </motion.div>
            <ToastContainer />
        </Box>
    );
};

export default Login;
