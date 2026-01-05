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
const {isError, user} = useSelector((state => state.auth));

useEffect(() => {
    dispatch(getMe());
}, [dispatch]);

useEffect(() => {
    if (isError) {
        navigate("/");
    }
    if (user && user.role !== "admin" && user.role !== "user") {
        navigate("/dashboard");
    }
}, [isError, user, navigate]);
const theme = useTheme();
const colors = tokens(theme.palette.mode);
const [achats, setAchats] = useState([]);
const [openModal, setOpenModal] = useState(false);
const [selectedRowData, setSelectedRowData] = useState(null); // État pour stocker les données de la ligne sélectionnée
const [openDeleteModal, setOpenDeleteModal] = useState(false);
const [selectedAchat, setSelectedAchat] = useState(null);


useEffect(() => {
    getAchats();
}, []);

const getAchats = async () => {
    const response = await axios.get('http://localhost:5000/achats');
    setAchats(response.data);
};

const handleOpenDeleteModal = (achat) => {
setSelectedAchat(achat);
setOpenDeleteModal(true);
};
const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedAchat(null);
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
            doc.text(`Descriptions: ${selectedRowData.description}`, 20, 50);
            doc.text(`Quantité: ${selectedRowData.qte}`, 20, 60);
            doc.text(`Catégorie: ${selectedRowData.categories}`, 20, 70);
            doc.text(`Prix unitaire: ${selectedRowData.montant} AR`, 20, 80);
            doc.text(`Date d'achat: ${selectedRowData.date_achat}`, 20, 90);
            doc.text(`Numéro de facturation: ${selectedRowData.num_factA}`, 20, 100);
            doc.text(`Prix total: ${selectedRowData.montant_total} AR`, 20, 110);
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
        setOpenDeleteModal(false); // Fermer le modal après suppression
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
        headerName: "Produit"
    },
    {
        field: "categories",
        headerName: "Catégorie",
        flex: 1,
    },
    {
        field: "name_four",
        headerName: "Fournisseur",
        flex: 1,
    },
    {
        field: "description",
        headerName: "Déscription",
        flex: 1,
    },
    {
        field: "qte",
        headerName: "Quantité",
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
                <IconButton onClick={() => handleOpenDeleteModal(params.row)} color="secondary">
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
                        Êtes-vous sûr de vouloir supprimer cet achat ?
                    </Typography>
                    <Box mt={2}>
                        <Button onClick={() => {
                            deleteAchat(selectedAchat.uuid);
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
                        IMPRIMER LES DONNEES D'ACHAT
                    </Typography>

                    {/* Afficher les données de la ligne sélectionnée */}
                    {selectedRowData && (
                        <Box>
                            <Typography variant="body1">Créé par: {selectedRowData.createdBy}</Typography>
                            <Typography variant="body1">Fournisseur: {selectedRowData.name_four}</Typography>
                            <Typography variant="body1">Produit: {selectedRowData.name}</Typography>
                            <Typography variant="body1">Quantité: {selectedRowData.qte}</Typography>
                            <Typography variant="body1">Prix unitaire: {selectedRowData.montant} AR</Typography>
                            <Typography variant="body1">Prix total: {selectedRowData.montant_total} AR</Typography>
                            <Typography variant="body1">Date d'achat: {selectedRowData.date_achat}</Typography>
                            <Typography variant="body1">Numéro de facturation: {selectedRowData.num_factA}</Typography>
                            <Typography variant="body1">Status: {selectedRowData.validated}</Typography>
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

export default Achats;
