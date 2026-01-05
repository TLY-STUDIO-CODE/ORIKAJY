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


const EditProduct = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { isError} = useSelector(state => state.auth);
const [name, setName] = useState("");
const [price, setPrice] = useState("");
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
    const getProductById = async () =>{
        try {
            const response = await axios.get(`http://localhost:5000/products/${id}`);
            setName(response.data.name);
            setPrice(response.data.price);
        } catch (error) {
            if(error.response) {
            setMsg(error.response.data.msg);
            }
        }
    }
    getProductById();
}, [id]);

const updateProduct = async(e) =>{
    e.preventDefault();
    try {
        await axios.patch(`http://localhost:5000/products/${id}`, {
            name: name,
            price: price
        });
        navigate("/products");
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
            <Header title="METTRE A JOUR PRODUIT" subtitle="Mettre à jour un produit" />

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
                                label="Nom de produit"
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
                                label="Prix"
                                onBlur={handleBlur}
                                onChange={(e) => setPrice(e.target.value)}
                                value={price}
                                name="price"
                                error={!!touched.price && !!errors.price}
                                helperText={touched.price && errors.price}
                                sx={{ gridColumn: "span 2" }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained" onClick={updateProduct}>
                                Mettre à jour
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
    price: yup.string().required("required"),
    
});

const initialValues = {
    name: "",
    price: "",
    
};

export default EditProduct;
