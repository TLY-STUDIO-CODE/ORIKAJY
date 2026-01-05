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
const { user, isError, isSuccess, isLoading, message } = useSelector( (state) => state.auth );
const theme = useTheme();
const colors = tokens(theme.palette.mode);
const [showPassword, setShowPassword] = useState(false);

useEffect(() => {
if (user || isSuccess) {
    // Stocker le token JWT dans le stockage local
    localStorage.setItem('token', user.token);
    toast.success("Connexion réussie, redirection vers le tableau de bord...", { autoClose: 10000 });
    setTimeout(() => {
    navigate("/dashboard");
    }, 5000);
}
dispatch(reset());
}, [user, isSuccess, dispatch, navigate]);

const Auth = (e) => {
e.preventDefault();
dispatch(LoginUser({ email, password }));
};

useEffect(() => {
if (isError) {
    toast.error(message, { autoClose: 10000 });
}
}, [isError, message]);

const handleClickShowPassword = () => {
setShowPassword(!showPassword);
};

return (
<Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor={colors.primary[500]} >
    <Box display="flex" flexDirection="column" alignItems="center">
    <motion.div initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} style={{ textAlign: 'center', marginBottom: '20px' }} >
        <Typography variant="h1" color={colors.greenAccent[500]}> Bienvenue </Typography>
        <Typography variant="h4" color={colors.grey[100]}> Veuillez vous connecter ! </Typography>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} >
        <Box p={4} width={400} bgcolor={colors.primary[400]} boxShadow={3} borderRadius={2} display="flex" flexDirection="column" alignItems="center" >
        <Typography variant="h4" mb={2} color={colors.greenAccent[500]}> CONNECTEZ-VOUS </Typography>
        <form onSubmit={Auth} style={{ width: '100%' }}>
            <TextField fullWidth variant="outlined" type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" required sx={{ input: { color: colors.grey[100] }, }} />
            <TextField fullWidth variant="outlined" type={showPassword ? "text" : "password"} label="Password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" required sx={{ input: { color: colors.grey[100] }, }} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={handleClickShowPassword} edge="end"> {showPassword ? <Visibility /> : <VisibilityOff />} </IconButton></InputAdornment>, }} />
            <Box mt={2}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : <Button type="submit" variant="contained" color="secondary" fullWidth> Se connecter </Button>}
            </Box>
        </form>
        </Box>
    </motion.div>
    <ToastContainer />
    </Box>
</Box>
);
};

export default Login;
