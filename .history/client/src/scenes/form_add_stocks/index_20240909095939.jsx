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


const AddStock = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { isError} = useSelector(state => state.auth);

const [name, setName] = useState("");
const [name_four, setName_four] = useState("");
const [qte, setQte] = useState("");
const [montantS, setMontantS] = useState("");
const [categories, setCategories] = useState("");
const [date_stock, setDate_stock] = useState("");
const [num_fact, setNum_fact] = useState("");
const [msg, setMsg] = useState("");

useEffect(() => {
    dispatch(getMe());
}, [ dispatch]);

useEffect(() => {
    if(isError){
        navigate("/");
    }
}, [isError, navigate]);

const saveStock = async(e) =>{
    e.preventDefault();
    try {
        await axios.post('http://localhost:5000/stocks', {
            name: name,
            name_four: name_four,
            qte: qte,
            montantS: montantS,
            categories: categories,
            date_stock: date_stock,
            num_fact: num_fact,
        });
        navigate("/stocks");
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
            <Header title="NOUVEAU STOCK" subtitle="Ajouter un nouveau stock de produit" />

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
                                sx={{ gridColumn: "span 4" }}
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
                                sx={{ gridColumn: "span 4" }}
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
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Prix unitaire"
                                onBlur={handleBlur}
                                onChange={(e) => setMontantS(e.target.value)}
                                value={montantS}
                                name="montantS"
                                error={!!touched.montantS && !!errors.montantS}
                                helperText={touched.montantS && errors.montantS}
                                sx={{ gridColumn: "span 4" }}
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
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="date"
                                label="Date de mise en stock"
                                onBlur={handleBlur}
                                onChange={(e) => setDate_stock(e.target.value)}
                                value={date_stock}
                                name="date_stock"
                                error={!!touched.date_stock && !!errors.date_stock}
                                helperText={touched.date_stock && errors.date_stock}
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Numéro de facturation"
                                onBlur={handleBlur}
                                onChange={(e) => setNum_fact(e.target.value)}
                                value={num_fact}
                                name="num_fact"
                                error={!!touched.num_fact && !!errors.num_fact}
                                helperText={touched.num_fact && errors.num_fact}
                                sx={{ gridColumn: "span 4" }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained" onClick={saveStock}>
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
    name_four: yup.string().required("required"),
    qte: yup.string().required("required"),
    montantS: yup.string().required("required"),
    categories: yup.string().required("required"),
    date_stock:yup.string().required("required"),
    num_fact: yup.string().required("required")
    
    
});

const initialValues = {
    name: "",
    name_four: "",
    qte:"",
    montantS:"",
    categories:"",
    date_stock:"",
    num_fact:""
    
};

export default AddStock;