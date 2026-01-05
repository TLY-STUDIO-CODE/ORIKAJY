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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Achats = () => {
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
const [achats, setAchats] = useState([]);
const [openModal, setOpenModal] = useState(false);
const [selectedRowData, setSelectedRowData] = useState(null); // État pour stocker les données de la ligne sélectionnée


useEffect(() => {
    getAchats();
}, []);

const getAchats = async () => {
    const response = await axios.get('http://localhost:5000/achats');
    setAchats(response.data);
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
            doc.text("DONNEES D'ACHAT", 20, 10);
            doc.text(`Créé par: ${selectedRowData.createdBy}`, 20, 20);
            doc.text(`Fourniseur: ${selectedRowData.name_four}`, 20, 30);
            doc.text(`Produits: ${selectedRowData.name}`, 20, 40);
            doc.text(`Descriptions de achat: ${selectedRowData.description}`, 20, 50);
            doc.text(`Quantité de produit : ${selectedRowData.qte}`, 20, 60);
            doc.text(`Catégorie de produit: ${selectedRowData.categories}`, 20, 70);
            doc.text(`Prix unitaire de produit: ${selectedRowData.montant} AR`, 20, 80);
            doc.text(`Date de achat: ${selectedRowData.date_achat}`, 20, 90);
            doc.text(`Numéro de facturation: ${selectedRowData.num_factA}`, 20, 100);
            doc.text(`Total Montant: ${selectedRowData.montant_total} AR`, 20, 110);
            doc.text(`Status: ${selectedRowData.validated}`, 20, 120);

            // Générer et télécharger le fichier PDF
            doc.save("facture.pdf");
        }
    };
const validateAchat = async (achatId) => {
    try {
        await axios.patch(`http://localhost:5000/achats/validate/${achatId}`);
        getAchats();
        toast.success("Achat validé avec succès!", {
            autoClose: 10000, // 30 seconds
        });
    } catch (error) {
        toast.error("Erreur lors de la validation de l'achat.", {
            autoClose: 10000
        });
    }
};

const deleteAchat = async (achatId) => {
        try {
            await axios.delete(`http://localhost:5000/achats/${achatId}`);
            getAchats();
            toast.success("Achat supprimé avec succès!", {
                autoClose: 10000, // 30 seconds
            });
        } catch (error) {
            toast.error("Erreur lors de la suppression d'achat.", {
                autoClose: 10000
            });
        }
    };

const generateInvoice = (achat) => {
        navigate(`/invoice/${achat.uuid}`);
    };

const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
        field: "name",
        headerName: "Nom du produit"
    },
    {
        field: "categories",
        headerName: "Catégorie du produit",
        flex: 1,
    },
    {
        field: "name_four",
        headerName: "Nom du fournisseur",
        flex: 1,
    },
    {
        field: "description",
        headerName: "Déscription de l'achat",
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
        field: "date_achat",
        headerName: "Date d'achat",
        flex: 1,
    },
    {
        field: "num_factA",
        headerName: "Numéro de facturation",
        flex: 1,
    },
    {
        field: "validated",
        headerName: "Status",
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
                    onClick={() => deleteAchat(params.row.uuid)} 
                    color="secondary"
                >
                    <DeleteIcon />
                </IconButton>
                <IconButton 
                    onClick={() => validateAchat(params.row.uuid)} 
                    color="secondary"
                >
                    <CheckCircleIcon />
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
const rows = achats.map((achat, index) => ({
    id: index + 1,
    uuid: achat.uuid,
    name: achat.name,
    name_four: achat.name_four,
    description: achat.description,
    qte: achat.qte,
    unit: achat.unit,
    categories: achat.categories,
    montant: achat.montant,
    montant_total: achat.montant_total,
    date_achat: achat.date_achat,
    num_factA: achat.num_factA,
    createdBy: achat.user.name,
    validated: achat.validated
}));

return (
<Box m="20px">
<Header title="ACHATS" subtitle="Liste de tous les achats de produit" />
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
                        IMPRIMER LES DONNEES D'ACHAT
                    </Typography>

                    {/* Afficher les données de la ligne sélectionnée */}
                    {selectedRowData && (
                        <Box>
                            <Typography variant="body1">Créé par: {selectedRowData.createdBy}</Typography>
                            <Typography variant="body1">Fournisseur: {selectedRowData.name_four}</Typography>
                            <Typography variant="body1">Produit: {selectedRowData.name}</Typography>
                            <Typography variant="body1">Quantité: {selectedRowData.qte}</Typography>
                            <Typography variant="body1">Prix: {selectedRowData.montant} AR</Typography>
                            <Typography variant="body1">Total prix: {selectedRowData.montant_total} AR</Typography>
                            <Typography variant="body1">Date: {selectedRowData.date_achat}</Typography>
                            <Typography variant="body1">Numéro de facturation: {selectedRowData.num_factA}</Typography>
                        </Box>
                    )}

                    <Button onClick={handleGenerateInvoice} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Imprimer
                    </Button>
                </Box>
            </Modal>
            <ToastContainer />
</Box>
);
};

export default Achats;
