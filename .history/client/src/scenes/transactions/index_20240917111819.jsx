import { Box, useTheme, IconButton, Modal, Typography, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import React, { useEffect, useState } from 'react';
import Header from "../../components/Header";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom"; // Pour rediriger vers la page d'édition
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';
import axios from "axios";
import jsPDF from "jspdf";  // Importation de jsPDF
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
const [openModal, setOpenModal] = useState(false);
const [selectedRowData, setSelectedRowData] = useState(null); // État pour stocker les données de la ligne sélectionnée


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
            acc[num_factT].types.push(transaction.type_transaction);
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
    const handleOpenModal = (rowData) => {
        setSelectedRowData(rowData); // Mettre à jour l'état avec les données de la ligne sélectionnée
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedRowData(null); // Réinitialiser les données de la ligne sélectionnée après la fermeture
    };

    const handleGenerateInvoice = () => {
        if (selectedRowData) {
            const doc = new jsPDF();

            // Titre de la facture
            doc.text("Transaction", 20, 10);
            doc.text(`Descriptions de transaction: ${selectedRowData.descriptions.join(", ")}`, 20, 20);
            doc.text(`Quantité de produit : ${selectedRowData.qtes.join(", ")}`, 20, 30);
            doc.text(`Type de transaction: ${selectedRowData.types.join(", ")}`, 20, 40);
            doc.text(`Prix unitaire de produit: ${selectedRowData.montants.join(", ")}`, 20, 50);
            doc.text(`Date de transaction: ${selectedRowData.date_transaction}`, 20, 60);
            doc.text(`Numéro de facturation: ${selectedRowData.num_factT}`, 20, 70);
            doc.text(`Total Montant: ${selectedRowData.montant_total} ar`, 20, 80);

            // Générer et télécharger le fichier PDF
            doc.save("facture.pdf");
        }
    };


    const deleteTransactions = async (transactionId) => {
        await axios.delete(`http://localhost:5000/transactions/${transactionId}`);
        getTransactions();
    };
    const generateInvoice = (transaction) => {
        navigate(`/invoice/${transaction.uuid}`);
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
            field: "types",
            headerName: "Type de transaction",
            flex: 1,
            valueGetter: (params) => params.row.types.join(", "),
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
                        onClick={() => handleOpenModal(params.row)}
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
 {/* Modal pour générer la facture */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Générer la Facture
                    </Typography>

                    {/* Afficher les données de la ligne sélectionnée */}
                    {selectedRowData && (
                        <Box>
                            <Typography variant="body1">Transaction fait par: {selectedRowData.createBy}</Typography>
                            <Typography variant="body1">Descriptions: {selectedRowData.descriptions.join(", ")}</Typography>
                            <Typography variant="body1">Total prix: {selectedRowData.montant_total} €</Typography>
                            <Typography variant="body1">Date: {selectedRowData.date_transaction}</Typography>
                        </Box>
                    )}

                    <Button onClick={handleGenerateInvoice} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Imprimer
                    </Button>
                </Box>
            </Modal>
</Box>
);
};

export default Transactions;