import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginUser, reset } from "../../features/authSlice";
import { Box, Button, TextField, Typography, CircularProgress, useTheme } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { tokens } from "../../theme";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isError, isSuccess, isLoading, message } = useSelector(
        (state) => state.auth
    );
    
    // Accéder au thème pour utiliser les couleurs définies
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        if (user || isSuccess) {
            navigate("/dashboard");
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
            bgcolor={colors.primary[500]}  // Couleur d'arrière-plan
        >
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Box
                    p={4}
                    width={350}
                    bgcolor={colors.primary[400]} // Couleur de fond de la boîte
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
                                backgroundColor: colors.blueAccent[600], // Utilisation des couleurs du thème
                                input: { color: colors.grey[100] }, // Couleur du texte
                            }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            type="password"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            sx={{
                                
                                input: { color: colors.grey[100] },
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
                                {isLoading ? <CircularProgress size={24} /> : 'Login'}
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
