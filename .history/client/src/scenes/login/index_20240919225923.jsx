import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginUser, reset } from "../../features/authSlice";
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

const Login = () => {
    

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isError, isSuccess, isLoading, message } = useSelector(
        (state) => state.auth
    );

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
            bgcolor="background.default"
        >
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Box
                    p={4}
                    width={350}
                    bgcolor="background.paper"
                    boxShadow={3}
                    borderRadius={2}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <Typography variant="h4" mb={2} color="primary">
                        Sign In
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
                        />
                        <Box mt={3}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={isLoading}
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
