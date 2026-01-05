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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AccountingEntries = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { isError, user } = useSelector((state => state.auth));
const [selectedEntry, setSelectedEntry] = useState(null);
const [openDeleteModal, setOpenDeleteModal] = useState(false);

useEffect(() => {
    dispatch(getMe());
}, [ dispatch]);

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
const [entries, setEntries] = useState([]);
const [openModal, setOpenModal] = useState(false);
const [selectedRowData, setSelectedRowData] = useState(null); // État pour stocker les données de la ligne sélectionnée

useEffect(() => {
    getAccountingEntries();
}, []);

const getAccountingEntries = async () => {
    const response = await axios.get('http://localhost:5000/accounting-entries');
    setEntries(response.data);
};
const handleOpenModal = (rowData) => {
    setSelectedRowData(rowData); // Mettre à jour l'état avec les données de la ligne sélectionnée
    setOpenModal(true);
};
const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRowData(null); // Réinitialiser les données de la ligne sélectionnée après la fermeture
};
const handleOpenDeleteModal = (entry) => {
    setSelectedEntry(entry);
    setOpenDeleteModal(true);
};

const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedEntry(null);
};

const handleGenerateInvoice = () => {
    if (selectedRowData) {
        const doc = new jsPDF();
        // Titre de la facture
        doc.text("DONNEES DE L'ECRITURE COMPTABLE ", 20, 10);
        doc.text(`Date de l'écriture : ${selectedRowData.date}`, 20, 20);
        doc.text(`Déscription de l'écriture : ${selectedRowData.description}`, 20, 30);
        doc.text(`Montant : ${selectedRowData.amount}`, 20, 40);
        doc.text(`Status : ${selectedRowData.validated}`, 20, 50);

        // Générer et télécharger le fichier PDF
        doc.save("Données_écriture_comptable.pdf");
    }
};

const deleteEntrie = async (entrieId) => {
    try {
        await axios.delete(`http://localhost:5000/accounting-entries/${entrieId}`);
        getAccountingEntries();
        toast.success("L'écriture comptable est supprimé avec succès!", {
            autoClose: 10000, // 30 seconds
        });
        setOpenDeleteModal(false); // Fermer le modal après suppression
    } catch (error) {
        toast.error("Erreur lors de la suppression de l'écriture comptable.", {
            autoClose: 10000
        });
    }
};
const validateEntrie = async (entrieId) => {
    try {
        await axios.patch(`http://localhost:5000/accounting-entries/validate/${entrieId}`);
        getAccountingEntries();
        toast.success("L'écriture comptable est validé avec succès!", {
            autoClose: 10000, // 30 seconds
        });
    } catch (error) {
        toast.error("Erreur lors de la validation de l'écriture comptable.", {
            autoClose: 10000
        });
    }
};

const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
        field: "description",
        headerName: "Déscription de l'écriture",
        flex: 1,
    },
    {
        field: "amount",
        headerName: "Montant",
        flex: 1,
    },
    {
        field: "journalName",
        headerName: "Assigné au journal",
        flex: 1,
    },
    {
        field: "date",
        headerName: "Date d'écriture",
        flex: 1,
    },
    {
        field: "validated",
        headerName: "Status",
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
                    to={`/entries/edit/${params.row.uuid}`} 
                    color="secondary"
                >
                    <EditIcon />
                </IconButton>
                <IconButton 
                    onClick={() => validateEntrie(params.row.uuid)} 
                    color="secondary"
                >
                    <CheckCircleIcon />
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
const rows = entries.map((entrie, index) => ({
    id: index + 1,
    uuid: entrie.uuid,
    date: entrie.date,
    description: entrie.description,
    amount: entrie.amount,
    journalName: entrie.journal.name,
    validated: entrie.validated
}));

return (
<Box m="20px">
<Header title="ECRITURE COMPTABLE" subtitle="Liste de tous les écritures comptables" />
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
                        Êtes-vous sûr de vouloir supprimer cette écriture comptable ?
                    </Typography>
                    <Box mt={2}>
                        <Button onClick={() => {
                            deleteEntrie(selectedEntry.uuid);
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
                    IMPRIMER LES DONNEES DE L'ECRITURE COMPTABLE
                </Typography>

                {/* Afficher les données de la ligne sélectionnée */}
                {selectedRowData && (
                    <Box>
                        <Typography variant="body1">Déscription de l'écriture: {selectedRowData.description}</Typography>
                        <Typography variant="body1">Montant: {selectedRowData.amount} AR</Typography>
                        <Typography variant="body1">Status: {selectedRowData.validated}</Typography>
                        <Typography variant="body1">Date de l'écriture: {selectedRowData.date}</Typography>
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

export default AccountingEntries;
