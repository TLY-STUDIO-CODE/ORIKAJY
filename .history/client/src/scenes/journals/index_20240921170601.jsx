import { Box, useTheme, IconButton, Modal, Typography, Button  } from "@mui/material";
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

const Journals = () => {
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
const [journals, setJournals] = useState([]);
const [openModal, setOpenModal] = useState(false);
const [selectedRowData, setSelectedRowData] = useState(null); // État pour stocker les données de la ligne sélectionnée

useEffect(() => {
    getJournals();
}, []);

const getJournals = async () => {
    const response = await axios.get('http://localhost:5000/journals');
    setJournals(response.data);
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
        doc.text("DONNEES DU JOURNAL ", 20, 10);
        doc.text(`Nom du journal: ${selectedRowData.name}`, 20, 20);


        // Générer et télécharger le fichier PDF
        doc.save("Journal.pdf");
    }
};

const deleteJournal = async (journalId) => {
    try {
        await axios.delete(`http://localhost:5000/journals/${journalId}`);
        getJournals();
        toast.success("Journal supprimé avec succès!", {
            autoClose: 10000, // 30 seconds
        });
    } catch (error) {
        toast.error("Erreur lors de la suppression du journal.", {
            autoClose: 10000
        });
    }
};

const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
        field: "name",
        headerName: "Nom du journal",
        flex: 1,
    },
    {
        field: "actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params) => (
            <Box>
                <IconButton 
                    onClick={() => deleteJournal(params.row.uuid)} 
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
const rows = journals.map((journal, index) => ({
    id: index + 1,
    uuid: journal.uuid,
    name: journal.name,

}));

return (
<Box m="20px">
<Header title="JOURNAUX" subtitle="Liste de tous les journaux du plan comptable" />
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
                    IMPRIMER LES DONNEES DU JOURNAL
                </Typography>

                {/* Afficher les données de la ligne sélectionnée */}
                {selectedRowData && (
                    <Box>
                        <Typography variant="body1">Nom du journal: {selectedRowData.name}</Typography>
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

export default Journals;
