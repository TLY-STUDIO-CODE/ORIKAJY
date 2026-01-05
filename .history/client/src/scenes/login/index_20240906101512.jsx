import React, { useEffect, useState } from 'react';
import { tokens } from "../../theme";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginUser, reset } from "../../features/authSlice";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from '@mui/material/styles';

// Validation schema with yup
const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email address").required("Email is required"),
    password: yup.string().required("Password is required"),
});

// Initial values for the form
const initialValues = {
    email: "",
    password: "",
};

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode); // Assuming you have a tokens function
    const isNonMobile = useMediaQuery("(min-width:600px)");

    useEffect(() => {
        if (user || isSuccess) {
            navigate("/dashboard");
        }
        dispatch(reset());
    }, [user, isSuccess, dispatch, navigate]);

    // Form submission handler
    const handleSubmit = (values) => {
        dispatch(LoginUser(values));
    };

    return (
        <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="100vh" 
            bgcolor={colors.background}
        >
            <Box 
                width={isNonMobile ? "40%" : "90%"} 
                p={3} 
                bgcolor={colors.primary} 
                borderRadius="8px" 
                boxShadow={3}
            >
                <Formik
                    onSubmit={handleSubmit}
                    initialValues={initialValues}
                    validationSchema={loginSchema}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Box mb={2}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Email"
                                    type="text"
                                    name="email"
                                    value={values.email}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={!!touched.email && !!errors.email}
                                    helperText={touched.email && errors.email}
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={values.password}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={!!touched.password && !!errors.password}
                                    helperText={touched.password && errors.password}
                                />
                            </Box>
                            {isError && <Box mb={2}><p>{message}</p></Box>}
                            <Box display="flex" justifyContent="center">
                                <Button 
                                    type="submit" 
                                    color="primary" 
                                    variant="contained"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Loading...' : 'Login'}
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

export default Login;
