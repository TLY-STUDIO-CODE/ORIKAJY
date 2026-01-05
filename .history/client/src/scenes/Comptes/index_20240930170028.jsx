import { Box, useTheme, IconButton, Modal, Typography, Button  } from "@mui/material";
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
import jsPDF from "jspdf";  // Importation de jsPDF
import 'jspdf-autotable';  // Pour la génération automatique de tables
import PrintIcon from "@mui/icons-material/Print";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Comptes = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { isError, user } = useSelector((state => state.auth));
const [selectedCompte, setSelectedCompte] = useState(null);
const [openDeleteModal, setOpenDeleteModal] = useState(false);

useEffect(() => {
    dispatch(getMe());
}, [dispatch]);

useEffect(() => {
    if (isError) {
        navigate("/");
    }
    if (user && user.role !== "admin") {
        navigate("/dashboard");
    }
}, [isError, user, navigate]);

const theme = useTheme();
const colors = tokens(theme.palette.mode);
const [accounts, setAccounts] = useState([]);
const [openModal, setOpenModal] = useState(false);
const [selectedRowData, setSelectedRowData] = useState(null); // État pour stocker les données de la ligne sélectionnée

useEffect(() => {
    getAccounts();
}, []);

const getAccounts = async () => {
    const response = await axios.get('http://localhost:5000/accounts');
    setAccounts(response.data);
};
const handleOpenModal = (rowData) => {
    setSelectedRowData(rowData); // Mettre à jour l'état avec les données de la ligne sélectionnée
    setOpenModal(true);
};
const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRowData(null); // Réinitialiser les données de la ligne sélectionnée après la fermeture
};
const handleOpenDeleteModal = (compte) => {
    setSelectedCompte(compte);
    setOpenDeleteModal(true);
};

const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedCompte(null);
};


const handleGenerateInvoice = () => {
    if (selectedRowData) {
        const doc = new jsPDF();
        // Titre de la facture
        doc.text("DONNEES DU COMPTE ", 20, 10);
        doc.text(`Nom du compte: ${selectedRowData.name}`, 20, 20);
        doc.text(`Type du compte: ${selectedRowData.type}`, 20, 30);
        doc.text(`Solde du compte: ${selectedRowData.balance}`, 20, 40);

        // Générer et télécharger le fichier PDF
        doc.save("Données_comptes.pdf");
    }
};

const deleteAccount = async (accountId) => {
    try {
        await axios.delete(`http://localhost:5000/accounts/${accountId}`);
        getAccounts();
        toast.success("Le compte est supprimé avec succès!", {
            autoClose: 10000, // 30 seconds
        });
         setOpenDeleteModal(false); // Fermer le modal après suppression
    } catch (error) {
        toast.error("Erreur lors de la suppression du compte.", {
            autoClose: 10000
        });
    }
};

const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
        field: "name",
        headerName: "Nom du compte",
        flex: 1,
    },
    {
        field: "type",
        headerName: "Type du compte",
        flex: 1,
    },
    {
        field: "balance",
        headerName: "Solde du compte",
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
                    to={`/accounts/edit/${params.row.uuid}`} 
                    color="secondary"
                >
                    <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleOpenDeleteModal(params.row)} color="secondary">
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
const rows = accounts.map((account, index) => ({
    id: index + 1,
    uuid: account.uuid,
    name: account.name,
    type: account.type,
    balance: account.balance,

}));

return (
<Box m="20px">
<Header title="COMPTES" subtitle="Liste de tous les comptes dans le plan comptable" />
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
                        Êtes-vous sûr de vouloir supprimer ce compte?
                    </Typography>
                    <Box mt={2}>
                        <Button onClick={() => {
                            deleteAccount(selectedCompte.uuid);
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
                    IMPRIMER LES DONNEES DU COMPTE
                </Typography>

                {/* Afficher les données de la ligne sélectionnée */}
                {selectedRowData && (
                    <Box>
                        <Typography variant="body1">Nom du compte: {selectedRowData.name}</Typography>
                        <Typography variant="body1">Type du compte: {selectedRowData.type}</Typography>
                        <Typography variant="body1">Solde du compte: {selectedRowData.balance}</Typography>
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

export default Comptes;
