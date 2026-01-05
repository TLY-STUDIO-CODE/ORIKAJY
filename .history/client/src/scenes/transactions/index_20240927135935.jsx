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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Transactions = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { isError, user } = useSelector((state => state.auth));

useEffect(() => {
    dispatch(getMe());
}, [dispatch]);

useEffect(() => {
    if (isError) {
        navigate("/");
    }
    if (user && user.role !== "admin" && user.role !== "manager") {
        navigate("/dashboard");
    }
}, [isError, user, navigate]);

const theme = useTheme();
const colors = tokens(theme.palette.mode);
const [transactions, setTransactions] = useState([]);
const [openModal, setOpenModal] = useState(false);
const [selectedRowData, setSelectedRowData] = useState(null); // État pour stocker les données de la ligne sélectionnée
const [openDeleteModal, setOpenDeleteModal] = useState(false);
const [selectedTransaction, setSelectedTransaction] = useState(null);


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
    const handleOpenDeleteModal = (transaction) => {
setSelectedTransaction(transaction);
setOpenDeleteModal(true);
};
const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedTransaction(null);
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
            doc.text("DONNEES DE TRANSACTION", 20, 10);
            doc.text(`Créé par: ${selectedRowData.createdBy}`, 20, 20);
            doc.text(`Déscription du transaction: ${selectedRowData.descriptions.join(", ")}`, 20, 30);
            doc.text(`Quantité du produit : ${selectedRowData.qtes.join(", ")}`, 20, 40);
            doc.text(`Type du transaction: ${selectedRowData.types.join(", ")}`, 20, 50);
            doc.text(`Prix unitaire du produit: ${selectedRowData.montants.join(", ")} AR`, 20, 60);
            doc.text(`Date du transaction: ${selectedRowData.date_transaction}`, 20, 70);
            doc.text(`Numéro de facturation: ${selectedRowData.num_factT}`, 20, 80);
            doc.text(`Prix total: ${selectedRowData.montant_total} AR`, 20, 90);

            // Générer et télécharger le fichier PDF
            doc.save("facture.pdf");
        }
    };


const deleteTransactions = async (transactionId) => {
        try {
            await axios.delete(`http://localhost:5000/transactions/${transactionId}`);
            getTransactions();
            toast.success("Transaction supprimé avec succès!", {
                autoClose: 10000, // 30 seconds
            });
            setOpenDeleteModal(false); // Fermer le modal après suppression
        } catch (error) {
            toast.error("Erreur lors de la suppression du transaction.", {
                autoClose: 10000
            });
        }
    };
    const generateInvoice = (transaction) => {
        navigate(`/invoice/${transaction.uuid}`);
    };
    


    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "descriptions",
            headerName: "Déscription",
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
            headerName: "Quantité du produit",
            flex: 1,
            valueGetter: (params) => params.row.qtes.join(", "),
        },
        {
            field: "montants",
            headerName: "Prix unitaire",
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
            headerName: "Date du transaction",
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
                    {user && user.role !== "manager" && (
                    <IconButton onClick={() => handleOpenDeleteModal(params.row)} color="secondary">
                        <DeleteIcon />
                    </IconButton>
                    )}
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
<Header title="TRANSACTIONS" subtitle="Liste de tous les transactions dans l'application" />
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
{/* Modal de confirmation de suppression */}
            <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
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
                    <Typography variant="h6" component="h2">
                        Confirmer la suppression
                    </Typography>
                    <Typography variant="body1">
                        Êtes-vous sûr de vouloir supprimer ce transaction ?
                    </Typography>
                    <Box mt={2}>
                        <Button onClick={() => {
                            deleteTransactions(selectedTransaction.uuid);
                        }} variant="contained" color="secondary" sx={{ mr: 2 }}>
                            Supprimer
                        </Button>
                        <Button onClick={handleCloseDeleteModal} variant="outlined" color="secondary">
                            Annuler
                        </Button>
                    </Box>
                </Box>
            </Modal>
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
            IMPRIMER LES DONNEES DE TRANSACTION
        </Typography>

        {/* Afficher les données de la ligne sélectionnée */}
        {selectedRowData && (
            <Box>
                <Typography variant="body1">Créé par: {selectedRowData.createdBy}</Typography>
                <Typography variant="body1">Description du transaction: {selectedRowData.descriptions.join(", ")}</Typography>
                <Typography variant="body1">Type du transaction: {selectedRowData.types.join(", ")}</Typography>
                <Typography variant="body1">Quantité du produit: {selectedRowData.qtes.join(", ")}</Typography>
                <Typography variant="body1">Prix unitaire du produit: {selectedRowData.montants.join(", ")} AR</Typography>
                <Typography variant="body1">Prix total: {selectedRowData.montant_total} AR</Typography>
                <Typography variant="body1">Date du transaction: {selectedRowData.date_transaction}</Typography>
            </Box>
        )}
        <Button onClick={handleGenerateInvoice} variant="contained" color="secondary" sx={{ mr: 2 }}>
            Imprimer
        </Button>
        <Button onClick={handleCloseModal} variant="outlined" color="secondary">
            Annuler
        </Button>
    </Box>
</Modal>
<ToastContainer />
</Box>
);
};

export default Transactions;