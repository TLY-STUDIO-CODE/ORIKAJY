import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, IconButton, InputAdornment, MenuItem } from "@mui/material";
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

const AddUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector(state => state.auth);

    // États locaux pour gérer les champs et les messages
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [role, setRole] = useState("");
    const [image, setImage] = useState(null); // État pour l'image
    const [msg, setMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Pour gérer la visibilité du mot de passe

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate("/");
        }
        if (user && user.role !== "admin") {
            navigate("/dashboard");
        }
    }, [isError, user, navigate]);
const saveUser = async(e) =>{
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('confPassword', confPassword);
            formData.append('role', role);
            if (image) {
                formData.append('image', image); // Ajoutez l'image au formulaire
            }

            await axios.post('http://localhost:5000/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate("/users");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    // Gérer la visibilité du mot de passe
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = (values) => {
        console.log(values);
    };

    return (
        <Box m="20px">
            <Header title="NOUVEAU UTILISATEUR" subtitle="Créer un nouveau utilisateur" />

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={checkoutSchema}
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
                                label="Name"
                                onBlur={handleBlur}
                                onChange={(e) => setName(e.target.value)}
                                value={values.name}
                                name="name"
                                error={!!touched.name && !!errors.name}
                                helperText={touched.name && errors.name}
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Email"
                                onBlur={handleBlur}
                                onChange={(e) => setEmail(e.target.value)}
                                value={values.email}
                                name="email"
                                error={!!touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type={showPassword ? "text" : "password"}
                                label="Password"
                                onBlur={handleBlur}
                                onChange={(e) => setPassword(e.target.value)}
                                value={values.password}
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
                            <TextField
                                fullWidth
                                variant="filled"
                                type={showPassword ? "text" : "password"}
                                label="Confirm Password"
                                onBlur={handleBlur}
                                onChange={(e) => setConfPassword(e.target.value)}
                                value={values.confPassword}
                                name="confPassword"
                                error={!!touched.confPassword && !!errors.confPassword}
                                helperText={touched.confPassword && errors.confPassword}
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
                            <TextField
                                fullWidth
                                variant="filled"
                                select
                                label="Role"
                                onBlur={handleBlur}
                                onChange={(e) => setRole(e.target.value)}
                                value={values.role}
                                name="role"
                                error={!!touched.role && !!errors.role}
                                helperText={touched.role && errors.role}
                                sx={{ gridColumn: "span 4" }}
                            >
                                <MenuItem value="user">User</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </TextField>
                            <input
                                accept="image/*"
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])} // Gérez l'image ici
                            />
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained" onClick={saveUser}>
                                Créer
                            </Button>
                        </Box>
                        {msg && <p>{msg}</p>}
                    </form>
                )}
            </Formik>
        </Box>
    );
};

const checkoutSchema = yup.object().shape({
    name: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().password("invalid password").required("required"),
    confPassword: yup.string().confPassword("invalid confPassword").required("required").oneOf([yup.ref('password')], 'Passwords must match'),
    role: yup.string().required("required"),
});

const initialValues = {
    name: "",
    email: "",
    password: "",
    confPassword: "",
    role: "",
};

export default AddUser;
