import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import React, { useEffect, useState } from 'react';
import Header from "../../components/Header";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom"; // Pour rediriger vers la page d'édition
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';
import axios from "axios";


const Ventes2 = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const {isError} = useSelector((state => state.auth));

useEffect(() => {
    dispatch(getMe());
}, [ dispatch]);

useEffect(() => {
    if(isError){
        navigate("/");
    }
}, [isError, navigate]);

const theme = useTheme();
const colors = tokens(theme.palette.mode);
const [ventes2, setVentes2] = useState([]);

useEffect(() => {
    getVentes2();
}, []);

const getVentes2 = async () => {
    const response = await axios.get('http://localhost:5000/ventes2');
    setVentes2(response.data);
};

const deleteVente2 = async (venteId) => {
    await axios.delete(`http://localhost:5000/ventes2/${venteId}`);
    getVentes2();
};

const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
        field: "name",
        headerName: "Nom du produit"
    },
    {
        field: "name_client",
        headerName: "Nom du client",
        flex: 1,
    },
    {
        field: "description",
        headerName: "Description de vente",
        flex: 1,
    },
    {
        field: "qte",
        headerName: "Quantité du produit",
        flex: 1,
    },
    {
        field: "unit",
        headerName: "Unité",
        flex: 1,
    },
    {
        field: "categories",
        headerName: "Catégorie du produit",
        flex: 1,
    },
    {
        field: "montant",
        headerName: "Prix unitaire",
        flex: 1,
    },
    {
        field: "montant_total",
        headerName: "Prix total",
        flex: 1,
    },
    {
        field: "date_vente",
        headerName: "Date de vente"
    },
    {
        field: "num_factV",
        headerName: "Numéro de facturation",
        flex: 1,
    },
    {
        field: "createdBy",
        headerName: "Créé par",
        flex: 1,
    },
    {
        field: "actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params) => (
            <Box>
                <IconButton 
                    onClick={() => deleteVente2(params.row.uuid)} 
                    color="secondary"
                >
                    <DeleteIcon />
                </IconButton>
            </Box>
        ),
    },
];
const rows = ventes2.map((vente2, index) => ({
    id: index + 1,
    uuid: vente2.uuid,
    name: vente2.name,
    name_client: vente2.name_client,
    description: vente2.description,
    qte: vente2.qte,
    categories: vente2.categories,
    montant: vente2.montant,
    montant_total: vente2.montant_total,
    unit: vente2.unit,
    date_vente: vente2.date_vente,
    num_factV: vente2.num_factV,
    createdBy: vente2.user.name,
}));

return (
<Box m="20px">
<Header title="LISTE DES VENTES PROVISIONS" subtitle="Liste de tous les ventes de produit" />
<Box
    m="40px 0 0 0"
    height="75vh"
    sx={{
    "& .MuiDataGrid-root": {
        border: "none",
    },
    "& .MuiDataGrid-cell": {
        borderBottom: "none",
    },
    "& .name-column--cell": {
        color: colors.greenAccent[300],
    },
    "& .MuiDataGrid-columnHeaders": {
        backgroundColor: colors.blueAccent[700],
        borderBottom: "none",
    },
    "& .MuiDataGrid-virtualScroller": {
        backgroundColor: colors.primary[400],
    },
    "& .MuiDataGrid-footerContainer": {
        borderTop: "none",
        backgroundColor: colors.blueAccent[700],
    },
    "& .MuiCheckbox-root": {
        color: `${colors.greenAccent[200]} !important`,
    },
    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
        color: `${colors.grey[100]} !important`,
    },
    }}
>
<DataGrid 
    rows={rows} 
    columns={columns} 
    pageSize={10} 
    checkboxSelection 
    components={{ Toolbar: GridToolbar }} 
/>
</Box>
</Box>
);
};

export default Ventes2;