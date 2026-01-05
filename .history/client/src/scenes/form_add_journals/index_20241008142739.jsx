import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../features/authSlice';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const AddJournal = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const [name, setName] = useState("");
const [msg, setMsg] = useState("");
const { isError, user } = useSelector((state => state.auth));

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

const saveJournal = async(e) =>{
    e.preventDefault();
    try {
        await axios.post('http://localhost:5000/journals', {
            
            name: name,
        });
        toast.success("Nouveau journal créé avec succès!", {
                autoClose: 10000, // 30 seconds
            });
        setTimeout(() => {
                navigate("/journals");
            }, 2000); // Un petit délai avant la navigation
    } catch (error) {
        if(error.response) {
            setMsg(error.response.data.msg);
            toast.error(error.response.data.msg, {
                    autoClose: 10000, // 30 seconds
                });
        }
    }
};


    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = (values) => {
        console.log(values);
    };

    return (
        <Box m="20px">
            <Header title="NOUVEAU JOURNAL" subtitle="Formulaire de création d'un nouveau journal" />

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
                                label="Nom du journal"
                                onBlur={handleBlur}
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                name="name"
                                error={!!touched.name && !!errors.name}
                                helperText={touched.name && errors.name}
                                sx={{ gridColumn: "span 8" }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained" onClick={saveJournal}>
                                Créer
                            </Button>
                        </Box>
                        {msg && <p>{msg}</p>}
                    </form>
                )}
            </Formik>
            {/* Toast container */}
            <ToastContainer />
        </Box>
    );
};

const checkoutSchema = yup.object().shape({
    
    
    
});

const initialValues = {
    name: "",

};

export default AddJournal;