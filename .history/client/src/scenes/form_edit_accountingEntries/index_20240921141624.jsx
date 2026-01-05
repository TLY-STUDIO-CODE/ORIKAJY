import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getMe } from '../../features/authSlice';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditAccountingEntries = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { isError } = useSelector(state => state.auth);

const [msg, setMsg] = useState("");
const { id } = useParams();

// Récupérer les données de l'entrée comptable
useEffect(() => {
dispatch(getMe());
}, [dispatch]);

useEffect(() => {
if (isError) {
    navigate("/");
}
}, [isError, navigate]);

const [initialValues, setInitialValues] = useState({
description: "",
amount: "",
date: "",
});

useEffect(() => {
const getAccountingEntryById = async () => {
    try {
    const response = await axios.get(`http://localhost:5000/accounting-entries/${id}`);
    setInitialValues({
        description: response.data.description,
        amount: response.data.amount,
        date: response.data.date,
    });
    } catch (error) {
    if (error.response) {
        setMsg(error.response.data.msg);
    }
    }
};
getAccountingEntryById();
}, [id]);

// Mise à jour de l'écriture comptable
const updateAccountingEntry = async (values) => {
try {
    await axios.patch(`http://localhost:5000/accounting-entries/${id}`, {
    description: values.description,
    amount: values.amount,
    date: values.date,
    });
    toast.success("Écriture mise à jour avec succès!", {
    autoClose: 5000,
    });
    setTimeout(() => {
    navigate("/accounting-entries");
    }, 2000);
} catch (error) {
    if (error.response) {
    setMsg(error.response.data.msg);
    toast.error(error.response.data.msg, {
        autoClose: 5000,
    });
    }
}
};

const isNonMobile = useMediaQuery("(min-width:600px)");

const checkoutSchema = yup.object().shape({
description: yup.string().required("La description est requise"),
amount: yup.number().required("Le montant est requis").positive("Le montant doit être positif"),
date: yup.date().required("La date est requise"),
});

return (
<Box m="20px">
    <Header title="MISE A JOUR DE L'ECRITURE COMPTABLE" subtitle="Formulaire pour la mise à jour d'une écriture comptable" />

    <Formik
    enableReinitialize={true}
    initialValues={initialValues}
    validationSchema={checkoutSchema}
    onSubmit={(values) => {
        updateAccountingEntry(values);
    }}
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
            label="Description"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.description}
            name="description"
            error={!!touched.description && !!errors.description}
            helperText={touched.description && errors.description}
            sx={{ gridColumn: "span 2" }}
            />
            <TextField
            fullWidth
            variant="filled"
            type="number"
            label="Montant"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.amount}
            name="amount"
            error={!!touched.amount && !!errors.amount}
            helperText={touched.amount && errors.amount}
            sx={{ gridColumn: "span 2" }}
            />
            <TextField
            fullWidth
            variant="filled"
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.date}
            name="date"
            error={!!touched.date && !!errors.date}
            helperText={touched.date && errors.date}
            sx={{ gridColumn: "span 2" }}
            />
        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
            <Button type="submit" color="secondary" variant="contained">
            Mettre à jour
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

export default EditAccountingEntries;
