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

    const saveUser = async(e) => {
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
                        >
                            <TextField
                                label="Nom"
                                name="name"
                                value={values.name}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={handleBlur}
                                error={!!touched.name && !!errors.name}
                                helperText={touched.name && errors.name}
                            />
                            <TextField
                                label="Email"
                                name="email"
                                value={values.email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={handleBlur}
                                error={!!touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                            />
                            <TextField
                                label="Mot de passe"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={handleBlur}
                                error={!!touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowPassword}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Confirmer le mot de passe"
                                name="confPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={values.confPassword}
                                onChange={(e) => setConfPassword(e.target.value)}
                                onBlur={handleBlur}
                                error={!!touched.confPassword && !!errors.confPassword}
                                helperText={touched.confPassword && errors.confPassword}
                            />
                            <TextField
                                select
                                label="Rôle"
                                name="role"
                                value={values.role}
                                onChange={(e) => setRole(e.target.value)}
                                onBlur={handleBlur}
                                error={!!touched.role && !!errors.role}
                                helperText={touched.role && errors.role}
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="user">User</MenuItem>
                            </TextField>
                            <input
                                accept="image/*"
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])} // Gérez l'image ici
                            />
                        </Box>
                        {msg && <p>{msg}</p>}
                        <Box mt="20px">
                            <Button type="submit" variant="contained" color="primary" onClick={saveUser}>
                                Enregistrer
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

const checkoutSchema = yup.object().shape({
    name: yup.string().required("Nom requis"),
    email: yup.string().email("Email invalide").required("Email requis"),
    password: yup.string().required("Mot de passe requis"),
    confPassword: yup.string().oneOf([yup.ref('password'), null], "Les mots de passe doivent correspondre").required("Confirmation du mot de passe requise"),
    role: yup.string().required("Rôle requis"),
});

const initialValues = {
    name: "",
    email: "",
    password: "",
    confPassword: "",
    role: "",
};

export default AddUser;

