import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Select, MenuItem } from "@mui/material";
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

const AddCommande = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { isError} = useSelector(state => state.auth);

const [items, setItems] = useState([{ name: "", description: "", categories: "", qte: "", montantC: "", unit: "" }]);
const [name_client, setName_client] = useState("");
const [date_commande, setDate_commande] = useState("");
const [num_factC, setNum_factC] = useState("");

const [msg, setMsg] = useState("");

useEffect(() => {
dispatch(getMe());
}, [ dispatch]);

useEffect(() => {
if(isError){
navigate("/");
}
}, [isError, navigate]);

const handleItemChange = (index, field, value) => {
const newItems = [...items];
newItems[index] = { ...newItems[index], [field]: value };
setItems(newItems);
};

const addItem = () => {
if (items.length < 10) {
setItems([...items, { name: "", description: "", categories: "", qte: "", montantC: "", unit: "" }]);
} else {
setMsg("Vous ne pouvez ajouter que jusqu'à 10 produits.");
}
};

const removeItem = (index) => {
const newItems = items.filter((_, i) => i !== index);
setItems(newItems);
};

const saveCommande = async (e) => {
e.preventDefault();
if (items.length < 1) {
setMsg("Vous devez commander au moins un produit.");
return;
}
try {
await axios.post('http://localhost:5000/commandes', {
items,
name_client,
date_commande,
num_factC
});
toast.success("Commande créé avec succès!", {
                autoClose: 10000, // 30 seconds
            });
        setTimeout(() => {
                navigate("/commandes");
            }, 2000); // Un petit délai avant la navigation
    } catch (error) {
        if(error.response) {
            setMsg(error.response.data.msg);
            toast.error(error.response.data.msg, {
                    autoClose: 10000, // 30 seconds
                });
        }else {
setMsg("Erreur de serveur");
}
}
};

const isNonMobile = useMediaQuery("(min-width:600px)");

return (
<Box m="20px">
<Header title="NOUVEAU COMMANDES" subtitle="Commander un nouveau produit" />
<Formik
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

<form onSubmit={saveCommande}>
<Box
display="grid"
gap="30px"
gridTemplateColumns="repeat(4, minmax(0, 1fr))"
sx={{
"& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
}}
>
{items.map((item, index) => (
<React.Fragment key={index}>
<TextField
fullWidth
variant="filled"
type="text"
label="Nom du produit"
onChange={(e) => handleItemChange(index, 'name', e.target.value)}
value={item.name}
sx={{ gridColumn: "span 2" }}
/>
<TextField
fullWidth
variant="filled"
type="text"
label="Description de commande"
onChange={(e) => handleItemChange(index, 'description', e.target.value)}
value={item.description}

sx={{ gridColumn: "span 2" }}
/>
<TextField
fullWidth
variant="filled"
type="text"
label="Catégorie du produit"
onChange={(e) => handleItemChange(index, 'categories', e.target.value)}
value={item.categories}
sx={{ gridColumn: "span 2" }}
/>
<TextField
fullWidth
variant="filled"
type="number"
label="Quantité du produit"
onChange={(e) => handleItemChange(index, 'qte', e.target.value)}
value={item.qte}
sx={{ gridColumn: "span 2" }}
/>
<Select
fullWidth
variant="filled"
label="Unité"
value={item.unit}
onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
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
type="number"
label="Prix unitaire"
onChange={(e) => handleItemChange(index, 'montantC', e.target.value)}
value={item.montant}
sx={{ gridColumn: "span 2" }}
/>
<Button onClick={() => removeItem(index)} color="error" variant="outlined" sx={{ gridColumn: "span 2", mt: 2 }}>
Supprimer
</Button>
</React.Fragment>
))}
<Button onClick={addItem} color="primary" variant="contained" sx={{ gridColumn: "span 2", mt: 2 }}>
Ajouter un produit
</Button>
<TextField
fullWidth
variant="filled"
type="text"
label="Nom du client"
onChange={(e) => setName_client(e.target.value)}
value={name_client}
sx={{ gridColumn: "span 2" }}
/>
<TextField
fullWidth
variant="filled"
type="date"
label="Date de vente"
onChange={(e) => setDate_commande(e.target.value)}
value={date_commande}
sx={{ gridColumn: "span 2" }}
/>
<TextField
fullWidth
variant="filled"
type="text"
label="Numéro de facturation"
onChange={(e) => setNum_factC(e.target.value)}
value={num_factC}
sx={{ gridColumn: "span 2" }}
/>
</Box>
<Box display="flex" justifyContent="end" mt="20px">
<Button type="submit" color="secondary" variant="contained">
Commander
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
items: [
{ name: "", description: "", categories: "", qte: "", montantC: "" } // Valeurs initiales pour chaque élément
],
name_client: "",
date_commande: "",
num_factC: ""
};

export default AddCommande;
