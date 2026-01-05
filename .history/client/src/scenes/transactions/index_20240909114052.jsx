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


const Transactions = () => {
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
const [transactions, setTransactions] = useState([]);

useEffect(() => {
    getTransactions();
}, []);

const getTransactions = async () => {
    const response = await axios.get('http://localhost:5000/Transactions');
    setTransactions(response.data);
};

const deleteTransaction = async (transactionId) => {
    await axios.delete(`http://localhost:5000/transactions/${transactionId}`);
    getTransactions();
};

const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
        field: "description_transaction",
        headerName: "Description du transaction",
        flex: 1,
    },
    {
        field: "type_transaction",
        headerName: "Type du transaction",
        flex: 1,
    },
    {
        field: "qte_transaction",
        headerName: "Quantité",
        flex: 1,
    },
    {
        field: "montant_transaction",
        headerName: "Prix unitaire",
        flex: 1,
    },
    {
        field: "montant_total_transaction",
        headerName: "Prix total",
        flex: 1,
    },
    {
        field: "date_transaction",
        headerName: "Date de transaction"
    },
    {
        field: "num_factT",
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
                    onClick={() => deleteTransaction(params.row.uuid)} 
                    color="secondary"
                >
                    <DeleteIcon />
                </IconButton>
            </Box>
        ),
    },
];
const rows = transactions.map((transaction, index) => ({
    id: index + 1,
    uuid: transaction.uuid,
    description_transaction: transaction.description_transaction,
    type_transaction: transaction.type_transaction,
    qte_transaction: transaction.qte_transaction,
    montant_transaction: transaction.montant_transaction,
    montant_total_transaction: transaction.montant_total_transaction,
    date_transaction: transaction.date_transaction,
    num_factT: transaction.num_factT,
    createdBy: transaction.user.name,
}));

return (
<Box m="20px">
<Header title="LISTE DES TRANSACTIONS" subtitle="Liste de tous les transactions" />
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
    }
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

export default Transactions;