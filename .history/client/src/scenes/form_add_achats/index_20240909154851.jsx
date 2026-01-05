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


const AddAchat = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { isError} = useSelector(state => state.auth);

const [name, setName] = useState("");
const [name_four, setName_four] = useState("");
const [description, setDescription] = useState("");
const [qte, setQte] = useState("");
const [categories, setCategories] = useState("");
const [montant, setMontant] = useState("");
const [date_achat, setDate_achat] = useState("");
const [num_factA, setNum_factA] = useState("");
const [msg, setMsg] = useState("");

useEffect(() => {
    dispatch(getMe());
}, [ dispatch]);

useEffect(() => {
    if(isError){
        navigate("/");
    }
}, [isError, navigate]);

const saveAchat = async(e) =>{
    e.preventDefault();
    try {
        await axios.post('http://localhost:5000/achats', {
            name: name,
            name_four: name_four,
            description: description,
            qte: qte,
            categories: categories,
            montant: montant,
            date_achat: date_achat,
            num_factA: num_factA,
        });
        navigate("/achats");
    } catch (error) {
        if(error.response) {
            setMsg(error.response.data.msg);
        }
    }
};



    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = (values) => {
        console.log(values);
    };

    return (
        <Box m="20px">
            <Header title="NOUVEAU ACHAT" subtitle="Acheter un nouveau de produit" />

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
                                label="Nom du produit"
                                onBlur={handleBlur}
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                name="name"
                                error={!!touched.name && !!errors.name}
                                helperText={touched.name && errors.name}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Nom du fournisseur"
                                onBlur={handleBlur}
                                onChange={(e) => setName_four(e.target.value)}
                                value={name_four}
                                name="name_four"
                                error={!!touched.name_four && !!errors.name_four}
                                helperText={touched.name_four && errors.name_four}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Description d'achat"
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
                                label="Quantité du produit"
                                onBlur={handleBlur}
                                onChange={(e) => setQte(e.target.value)}
                                value={qte}
                                name="qte"
                                error={!!touched.qte && !!errors.qte}
                                helperText={touched.qte && errors.qte}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Catégorie du produit"
                                onBlur={handleBlur}
                                onChange={(e) => setCategories(e.target.value)}
                                value={categories}
                                name="categories"
                                error={!!touched.categories && !!errors.categories}
                                helperText={touched.categories && errors.categories}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Prix unitaire"
                                onBlur={handleBlur}
                                onChange={(e) => setMontant(e.target.value)}
                                value={montant}
                                name="montant"
                                error={!!touched.montant && !!errors.montant}
                                helperText={touched.montant && errors.montant}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="date"
                                label="Date d'achat"
                                onBlur={handleBlur}
                                onChange={(e) => setDate_achat(e.target.value)}
                                value={date_achat}
                                name="date_achat"
                                error={!!touched.date_achat && !!errors.date_achat}
                                helperText={touched.date_achat && errors.date_achat}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Numéro de facturation"
                                onBlur={handleBlur}
                                onChange={(e) => setNum_factA(e.target.value)}
                                value={num_factA}
                                name="num_fact"
                                error={!!touched.num_factA && !!errors.num_factA}
                                helperText={touched.num_factA && errors.num_factA}
                                sx={{ gridColumn: "span 2" }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained" onClick={saveAchat}>
                                Acheter
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
    
    
    
});

const initialValues = {
    name: "",
    name_four: "",
    description:"",
    qte:"",
    date_achat:"",
    categories:"",
    montant:"",
    num_factA:"",
    stockId:""
    
};

export default AddAchat;