import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import React, { useEffect, useState } from 'react';
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom"; // Pour rediriger vers la page d'édition
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';
import axios from "axios";
import { Link } from 'react-router-dom';

const Ventes = () => {
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
const [ventes, setVentes] = useState([]);

useEffect(() => {
    getVentes();
}, []);

const getVentes = async () => {
    const response = await axios.get('http://localhost:5000/ventes');
    setVentes(response.data);
};

const deleteVente = async (venteId) => {
    await axios.delete(`http://localhost:5000/ventes/${venteId}`);
    getVentes();
};

const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
        field: "name",
        headerName: "Nom produit"
    },
    {
        field: "name_client",
        headerName: "Nom client",
        flex: 1,
    },
    {
        field: "qte",
        headerName: "Quantité",
        flex: 1,
    },
    {
        field: "categories",
        headerName: "Catégorie",
        flex: 1,
    },
    {
        field: "date_vente",
        headerName: "Date de vente"
    },
    {
        field: "num_factV",
        headerName: "Numéro facturation",
        flex: 1,
    },
    {
        field: "createdBy",
        headerName: "Created By",
        flex: 1,
    },
    {
        field: "actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params) => (
            <Box>
                <IconButton 
                    component={Link} 
                    to={`/ventes/edit/${params.row.uuid}`} 
                    color="primary"
                >
                    <EditIcon />
                </IconButton>
                <IconButton 
                    onClick={() => deleteVente(params.row.uuid)} 
                    color="secondary"
                >
                    <DeleteIcon />
                </IconButton>
            </Box>
        ),
    },
];
const rows = ventes.map((vente, index) => ({
    id: index + 1,
    uuid: vente.uuid,
    name: vente.name,
    name_client: vente.name_client,
    qte: vente.qte,
    categories: vente.categories,
    date_vente: vente.date_vente,
    num_factV: vente.num_factV,
    createdBy: vente.user.name,
}));

return (
<Box m="20px">
<Header title="VENTE DES PRODUITS" subtitle="Vente des produits" />
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

export default Ventes;
