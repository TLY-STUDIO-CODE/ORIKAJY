import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, IconButton, InputAdornment } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../features/authSlice';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddUser = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector(state => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate("/");
        }
        if (user) {
            navigate("/dashboard");
        }
    }, [isError, user, navigate]);

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/login', {
                email,
                password
            });
            toast.success("Login successful!", {
                autoClose: 10000,
            });
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                toast.error(error.response.data.msg, {
                    autoClose: 10000,
                });
            }
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = (values) => {
        console.log(values);
    };

    return (
        <Box m="20px">
            <Header title="LOGIN" subtitle="Connectez-vous à votre compte" />

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={loginSchema}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                        >
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Email"
                                onBlur={handleBlur}
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                name="email"
                                error={!!touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type={showPassword ? "text" : "password"}
                                label="Mot de passe"
                                onBlur={handleBlur}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                name="password"
                                error={!!touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                                sx={{ gridColumn: "span 4" }}
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
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained" onClick={loginUser}>
                                Se connecter
                            </Button>
                        </Box>
                        {msg && <p>{msg}</p>}
                    </form>
                )}
            </Formik>
            <ToastContainer />
        </Box>
    );
};

const loginSchema = yup.object().shape({
    email: yup.string().email("Email invalide").required("Requis"),
    password: yup.string().required("Requis"),
});

const initialValues = {
    email: "",
    password: "",
};

export default AddUser;

