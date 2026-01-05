import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Select, MenuItem } from "@mui/material";
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



const EditStock = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { isError} = useSelector(state => state.auth);
const [name, setName] = useState("");
const [qte, setQte] = useState("");
const [unit, setUnit] = useState(""); // Added state for unit
const [montantS, setMontantS] = useState("");
const [categories, setCategories] = useState("");
const [date_stock, setDate_stock] = useState("");
const [num_fact, setNum_fact] = useState("");
const [msg, setMsg] = useState("");
const {id} = useParams();

useEffect(() => {
    dispatch(getMe());
}, [ dispatch]);

useEffect(() => {
    if(isError){
        navigate("/");
    }
}, [isError, navigate]);

useEffect(()=>{
    const getStockById = async () =>{
        try {
            const response = await axios.get(`http://localhost:5000/stocks/${id}`);
            setName(response.data.name);
            setQte(response.data.qte);
            setUnit(response.data.unit);
            setMontantS(response.data.montantS);
            setCategories(response.data.categories);
            setDate_stock(response.data.date_stock);
            setNum_fact(response.data.num_fact);
        } catch (error) {
            if(error.response) {
            setMsg(error.response.data.msg);
            }
        }
    }
    getStockById();
}, [id]);

const updateStock = async(e) =>{
    e.preventDefault();
    try {
        await axios.patch(`http://localhost:5000/stocks/${id}`, {
            name: name,
            qte: qte,
            unit: unit, // Added unit
            montantS: montantS,
            categories: categories,
            date_stock: date_stock,
            num_fact: num_fact
        });
        toast.success("Stock a été mise à jour avec succès!", {
                autoClose: 10000, // 30 seconds
            });
        setTimeout(() => {
                navigate("/stocks");
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
            <Header title="METTRE A JOUR STOCK" subtitle="Mettre à jour un stock de produit" />

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
                                label="Quantité du produit"
                                onBlur={handleBlur}
                                onChange={(e) => setQte(e.target.value)}
                                value={qte}
                                name="qte"
                                error={!!touched.qte && !!errors.qte}
                                helperText={touched.qte && errors.qte}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <Select
                                fullWidth
                                variant="filled"
                                label="Unité"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                sx={{ gridColumn: "span 2" }}
                            >
                                <MenuItem value="kilo">Kilo</MenuItem>
                                <MenuItem value="litre">Litre</MenuItem>
                                <MenuItem value="gramme">Gramme</MenuItem>
                                <MenuItem value="unité">Unité</MenuItem>
                            </Select>
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
                                type="date"
                                label="Date de mise en stock"
                                onBlur={handleBlur}
                                onChange={(e) => setDate_stock(e.target.value)}
                                value={date_stock}
                                name="date_stock"
                                error={!!touched.date_stock && !!errors.date_stock}
                                helperText={touched.date_stock && errors.date_stock}
                                sx={{ gridColumn: "span 2" }}
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
                                sx={{ gridColumn: "span 2" }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained" onClick={updateStock}>
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
    name: "",
    name_four: "",
    qte:"",
    montantS:"",
    categories:"",
    date_stock:"",
    num_fact:""
    
};

export default EditStock;
