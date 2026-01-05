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

// Fonction pour regrouper les ventes par name_client
    const groupVentesByClient = (ventes) => {
        const grouped = ventes.reduce((acc, vente) => {
            const { name_client } = vente;
            
            if (!acc[name_client]) {
                acc[name_client] = {
                    name_client,
                    names: [],
                    descriptions: [],
                    categories: [],
                    qtes: [],
                    montants: [],
                    montant_total: 0,
                    date_vente: vente.date_vente,
                    num_factV: vente.num_factV,
                    createdBy: vente.user.name,
                };
            }

            acc[name_client].names.push(vente.name);
            acc[name_client].descriptions.push(vente.description);
            acc[name_client].categories.push(vente.categories);
            acc[name_client].qtes.push(vente.qte);
            acc[name_client].montants.push(vente.montant);
            acc[name_client].montant_total += vente.montant * vente.qte;

            return acc;
        }, {});

        return Object.values(grouped); // Convertir l'objet en tableau
    };

    const getVentes2 = async () => {
        const response = await axios.get('http://localhost:5000/ventes2');
        const groupedVentes = groupVentesByClient(response.data);
        setVentes2(groupedVentes);
    };

    const deleteVentes2 = async (venteId) => {
        await axios.delete(`http://localhost:5000/ventes2/${venteId}`);
        getVentes2();
    };

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "names",
            headerName: "Produits",
            flex: 1,
            valueGetter: (params) => params.row.names.join(", "),
        },
        {
            field: "name_client",
            headerName: "Nom du client",
            flex: 1,
        },
        {
            field: "descriptions",
            headerName: "Descriptions",
            flex: 1,
            valueGetter: (params) => params.row.descriptions.join(", "),
        },
        {
            field: "qtes",
            headerName: "Quantités",
            flex: 1,
            valueGetter: (params) => params.row.qtes.join(", "),
        },
        {
            field: "categories",
            headerName: "Catégories",
            flex: 1,
            valueGetter: (params) => params.row.categories.join(", "),
        },
        {
            field: "montants",
            headerName: "Montants unitaires",
            flex: 1,
            valueGetter: (params) => params.row.montants.join(", "),
        },
        {
            field: "montant_total",
            headerName: "Montant total",
            flex: 1,
        },
        {
            field: "date_vente",
            headerName: "Date de vente",
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
                        onClick={() => deleteVentes2(params.row.id)} 
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
        ...vente2,
    }));

return (
<Box m="20px">
<Header title="LISTE DES VENTES" subtitle="Liste de tous les ventes de produit" />
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