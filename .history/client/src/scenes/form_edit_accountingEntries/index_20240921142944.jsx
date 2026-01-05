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


const EditAccountingEntrie = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { isError} = useSelector(state => state.auth);


const [description, setDescription] = useState("");
const [amount, setAmount] = useState("");
const [date, setDate] = useState("");
const {id} = useParams();
const [msg, setMsg] = useState("");

useEffect(() => {
    dispatch(getMe());
}, [ dispatch]);

useEffect(() => {
    if(isError){
        navigate("/");
    }
}, [isError, navigate]);

useEffect(()=>{
    const getAccountingEntryById = async () =>{
        try {
            const response = await axios.get(`http://localhost:5000/accounting-entries/${id}`);
            setDescription(response.data.description);
            setAmount(response.data.amount);
            setDate(response.data.date);
        } catch (error) {
            if(error.response) {
            setMsg(error.response.data.msg);
            }
        }
    }
    getAccountingEntryById();
}, [id]);

const updateAccountingEntry = async(e) =>{
    e.preventDefault();
    try {
        await axios.patch(`http://localhost:5000/accounting-entries/${id}`, {
            
            description: description,
            amount: amount,
            date: date
        });
        toast.success("Nouvel écriture mis à avec succès!", {
                autoClose: 10000, // 30 seconds
            });
        setTimeout(() => {
                navigate("/accounting-entries");
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
            <Header title="MISE A JOUR DE L'ECRITURE COMPTABLE" subtitle="Formulaire pour la mise à jour d'un écriture comptable" />

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
                                label="Déscription"
                                onBlur={handleBlur}
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                name="description"
                                error={!!touched.description && !!errors.description}
                                helperText={touched.description && errors.description}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Montant"
                                onBlur={handleBlur}
                                onChange={(e) => setAmount(e.target.value)}
                                value={amount}
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
                                onBlur={handleBlur}
                                onChange={(e) => setDate(e.target.value)}
                                value={date}
                                name="date"
                                error={!!touched.date && !!errors.date}
                                helperText={touched.date && errors.date}
                                sx={{ gridColumn: "span 2" }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained" onClick={updateAccountingEntry}>
                                Mettre à jour
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
    description:"",
    date:"",
    Amount:"",
};

export default EditAccountingEntrie;