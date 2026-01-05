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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Stocks = () => {
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
const [stocks, setStocks] = useState([]);

useEffect(() => {
    getStocks();
}, []);

const getStocks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/stocks');
            setStocks(response.data);
        } catch (error) {
            toast.error("Erreur lors de la récupération des stocks.", {
                autoClose: 30000
            });
        }
    };

    const deleteStock = async (stockId) => {
        try {
            await axios.delete(`http://localhost:5000/stocks/${stockId}`);
            getStocks();
            toast.success("Stock supprimé avec succès!", {
                autoClose: 30000, // 30 seconds
            });
        } catch (error) {
            toast.error("Erreur lors de la suppression du stock.", {
                autoClose: 30000
            });
        }
    };


const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
        field: "name",
        headerName: "Nom du produit"
    },
    {
        field: "qte",
        headerName: "Quantité du produit",
        flex: 1,
    },
    {
        field: "montantS",
        headerName: "Prix unitaire",
        flex: 1,
    },
    {
        field: "montant_totalS",
        headerName: "Prix total",
        flex: 1,
    },
    {
        field: "categories",
        headerName: "Catégorie du produit",
        flex: 1,
    },
    {
        field: "date_stock",
        headerName: "Date de mise en stock",
        flex: 1,
    },
    {
        field: "num_fact",
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
                    component={Link} 
                    to={`/stocks/edit/${params.row.uuid}`} 
                    color="primary"
                >
                    <EditIcon />
                </IconButton>
                <IconButton 
                    onClick={() => deleteStock(params.row.uuid)} 
                    color="secondary"
                >
                    <DeleteIcon />
                </IconButton>
            </Box>
        ),
    },
];
const rows = stocks.map((stock, index) => ({
    id: index + 1,
    uuid: stock.uuid,
    name: stock.name,
    qte: stock.qte,
    montantS: stock.montantS,
    montant_totalS: stock.montant_totalS,
    categories: stock.categories,
    date_stock: stock.date_stock,
    num_fact: stock.num_fact,
    createdBy: stock.user.name,
}));

return (
<Box m="20px">
<Header title="LISTE DES STOCKS" subtitle="Liste de tous les stocks de produit" />
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
<ToastContainer />
</Box>
);
};

export default Stocks;
