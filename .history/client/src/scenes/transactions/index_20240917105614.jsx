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
import 'jspdf-autotable';  // Pour la génération automatique de tables
import PrintIcon from "@mui/icons-material/Print";


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

// Fonction pour regrouper les ventes par num_factT
    const groupTransactionsByClient = (transactions) => {
        const grouped = transactions.reduce((acc, transaction) => {
            const { num_factT } = transaction;
            
            if (!acc[num_factT]) {
                acc[num_factT] = {
                    uuid: transaction.uuid, 
                    num_factT,
                    descriptions: [],
                    types: [],
                    qtes: [],
                    montants: [],
                    montant_total: 0,
                    date_transaction: transaction.date_transaction,
                    createdBy: transaction.user.name,
                };
            }

            acc[num_factT].descriptions.push(transaction.description_transaction);
            acc[num_factT].qtes.push(transaction.qte_transaction);
            acc[num_factT].montants.push(transaction.montant_transaction);
            acc[num_factT].montant_total += transaction.montant_transaction * transaction.qte_transaction;

            return acc;
        }, {});

        return Object.values(grouped); // Convertir l'objet en tableau
    };

    const getTransactions = async () => {
        const response = await axios.get('http://localhost:5000/transactions');
        const groupedTransactions = groupTransactionsByClient(response.data);
        setTransactions(groupedTransactions);
    };

    const deleteTransactions = async (transactionId) => {
        await axios.delete(`http://localhost:5000/transactions/${transactionId}`);
        getTransactions();
    };
    const printInvoice = (transaction) => {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Imprimer facture</title>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(`<p>Descriptions de transaction: ${transaction.descriptions.join(", ")}</p>`);
        printWindow.document.write(`<p>Quantité de produit : ${transaction.qtes.join(", ")}</p>`);
        printWindow.document.write(`<p>Catégorie de produit: ${transaction.categories.join(", ")}</p>`);
        printWindow.document.write(`<p>Prix unitaire de produit: ${transaction.montants.join(", ")}</p>`);
        printWindow.document.write(`<p>Date de transaction: ${transaction.date_transaction}</p>`);
        printWindow.document.write(`<p>Numéro de facturation: ${transaction.num_factT}</p>`);
        printWindow.document.write(`<p>Total prix: ${transaction.montant_total_transaction} AR</p>`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };


    const columns = [
        { field: "id", headerName: "ID", width: 90 },
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
            field: "montants",
            headerName: "Prix unitaires",
            flex: 1,
            valueGetter: (params) => params.row.montants.join(", "),
        },
        {
            field: "montant_total",
            headerName: "Prix total",
            flex: 1,
        },
        {
            field: "date_transaction",
            headerName: "Date de transaction",
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
                        onClick={() => deleteTransactions(params.row.uuid)} 
                        color="secondary"
                    >
                        <DeleteIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => printInvoice(params.row)}
                        color="secondary"
                    >
                        <PrintIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const rows = transactions.map((transaction, index) => ({
        id: index + 1,
        uuid: transaction.uuid,
        ...transaction,
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