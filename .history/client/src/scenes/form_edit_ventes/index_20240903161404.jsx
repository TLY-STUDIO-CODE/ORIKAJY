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


const EditVente = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { isError} = useSelector(state => state.auth);
const [name, setName] = useState("");
const [name_client, setName_client] = useState("");
const [description, setDescription] = useState("");
const [qte, setQte] = useState("");
const [categories, setCategories] = useState("");
const [montant, setMontant] = useState("");
const [date_vente, setDate_vente] = useState("");
const [num_factV, setNum_factV] = useState("");
const [stockId, setStockId] = useState("");
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
    const getAchatById = async () =>{
        try {
            const response = await axios.get(`http://localhost:5000/ventes/${id}`);
            setName(response.data.name);
            setName_client(response.data.name_client);
            setQte(response.data.qte);
            setCategories(response.data.categories);
            setDescription(response.data.description);
            setMontant(response.data.montant);
            setDate_vente(response.data.date_vente);
            setNum_factV(response.data.num_factV);
        } catch (error) {
            if(error.response) {
            setMsg(error.response.data.msg);
            }
        }
    }
    getAchatById();
}, [id]);

const updateVente = async(e) =>{
    e.preventDefault();
    try {
        await axios.patch(`http://localhost:5000/ventes/${id}`, {
            name: name,
            name_four: name_client,
            description: description,
            qte: qte,
            categories: categories,
            montant: montant,
            date_vente: date_vente,
            num_factV: num_factV,
            stockId: stockId
        });
        navigate("/ventes");
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
            <Header title="METTRE A JOUR VENTE" subtitle="Mise à jour d'un vente de produit" />

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
                            label="Nom fclient"
                            onBlur={handleBlur}
                            onChange={(e) => setName_client(e.target.value)}
                            value={name_client}
                            name="name_client"
                            error={!!touched.name_client && !!errors.name_client}
                            helperText={touched.name_client && errors.name_client}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Description de vente"
                            onBlur={handleBlur}
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            name="description"
                            error={!!touched.description && !!errors.description}
                            helperText={touched.description && errors.description}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Quantité"
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
                            label="Catégorie"
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
                            type="text"
                            label="Montant"
                            onBlur={handleBlur}
                            onChange={(e) => setMontant(e.target.value)}
                            value={montant}
                            name="montant"
                            error={!!touched.montant && !!errors.montant}
                            helperText={touched.montant && errors.montant}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="date"
                            label="Date de vente"
                            onBlur={handleBlur}
                            onChange={(e) => setDate_vente(e.target.value)}
                            value={date_vente}
                            name="date_achat"
                            error={!!touched.date_vente && !!errors.date_vente}
                            helperText={touched.date_vente && errors.date_achat}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Numéro facturation"
                            onBlur={handleBlur}
                            onChange={(e) => setNum_factV(e.target.value)}
                            value={num_factV}
                            name="num_factV"
                            error={!!touched.num_factV && !!errors.num_factV}
                            helperText={touched.num_factV && errors.num_factV}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="ID stock"
                            onBlur={handleBlur}
                            onChange={(e) => setStockId(e.target.value)}
                            value={stockId}
                            name="stockId"
                            error={!!touched.stockId && !!errors.stockId}
                            helperText={touched.stockId && errors.stockId}
                            sx={{ gridColumn: "span 4" }}
                        />
                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px">
                        <Button type="submit" color="secondary" variant="contained" onClick={updateVente}>
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
name_client: yup.string().required("required"),
description: yup.string().required("required"),
qte: yup.string().required("required"),
date_vente:yup.string().required("required"),
categories: yup.string().required("required"),
montant: yup.string().required("required"),
num_factV: yup.string().required("required"),
stockId: yup.string().required("required")


});

const initialValues = {
name: "",
name_client: "",
description:"",
qte:"",
date_vente:"",
categories:"",
montant:"",
num_factV:"",
stockId:""

};

export default EditVente;
