import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, useTheme, IconButton, Modal, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import jsPDF from 'jspdf';  // Importation de jsPDF
import 'jspdf-autotable';  // Pour la génération automatique de tables
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuditAdmin = () => {
    const [logs, setLogs] = useState([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openPrintModal, setOpenPrintModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/audits');
            setLogs(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des logs :", error.message);
        }
    };

    const deleteLog = async (logId) => {
        try {
            await axios.delete(`http://localhost:5000/audits/${logId}`);
            fetchLogs(); // Recharger les logs après suppression
            toast.success("Audit supprimé avec succès!");
            setOpenDeleteModal(false); // Fermer le modal après suppression
        } catch (error) {
            toast.error("Erreur lors de la suppression de l'audit.");
        }
    };

    const handleOpenDeleteModal = (log) => {
        setSelectedLog(log);
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setSelectedLog(null);
    };

    const handleOpenPrintModal = (log) => {
        setSelectedLog(log);
        setOpenPrintModal(true);
    };

    const handleClosePrintModal = () => {
        setOpenPrintModal(false);
        setSelectedLog(null);
    };

    const handlePrintLog = () => {
        if (selectedLog) {
            const doc = new jsPDF();
            doc.text("Détails de l'Audit", 20, 10);
            doc.text(`ID: ${selectedLog.id}`, 20, 20);
            doc.text(`Action: ${selectedLog.action}`, 20, 30);
            doc.text(`Utilisateur: ${selectedLog.userName}`, 20, 40);
            doc.text(`Détails: ${selectedLog.details}`, 20, 50);
            doc.text(`Timestamp: ${new Date(selectedLog.timestamp).toLocaleString()}`, 20, 60);

            doc.save("audit.pdf");
            setOpenPrintModal(false); // Fermer le modal après impression
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'action', headerName: 'Action', flex: 1 },
        { field: 'userName', headerName: 'Utilisateur', flex: 1 }, // Changer userId en userName
        { field: 'details', headerName: 'Détails', flex: 2 },
        { field: 'timestamp', headerName: 'Timestamp', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => handleOpenDeleteModal(params.row)} color="secondary">
                        <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenPrintModal(params.row)} color="primary">
                        <PrintIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const rows = logs.map((log) => ({
        id: log.id,
        action: log.action,
        userName: log.userName, // Utiliser userName ici
        details: log.details,
        timestamp: new Date(log.timestamp).toLocaleString(),
    }));

    return (
        <Box m="20px">
            <Typography variant="h4" gutterBottom>
                Logs d'Audit
            </Typography>
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
                        Êtes-vous sûr de vouloir supprimer cet audit ?
                    </Typography>
                    <Box mt={2}>
                        <Button onClick={() => {
                            deleteLog(selectedLog.id);
                        }} variant="contained" color="secondary" sx={{ mr: 2 }}>
                            Supprimer
                        </Button>
                        <Button onClick={handleCloseDeleteModal} variant="outlined" color="primary">
                            Annuler
                        </Button>
                    </Box>
                </Box>
            </Modal>
            {/* Modal pour imprimer le log */}
            <Modal open={openPrintModal} onClose={handleClosePrintModal}>
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
                        IMPRIMER LES DONNEES DE L'AUDIT
                    </Typography>
                    {/* Afficher les données du log sélectionné */}
                    {selectedLog && (
                        <Box>
                            <Typography variant="body1">ID: {selectedLog.id}</Typography>
                            <Typography variant="body1">Action: {selectedLog.action}</Typography>
                            <Typography variant="body1">Utilisateur: {selectedLog.userName}</Typography>
                            <Typography variant="body1">Détails: {selectedLog.details}</Typography>
                            <Typography variant="body1">Timestamp: {new Date(selectedLog.timestamp).toLocaleString()}</Typography>
                        </Box>
                    )}
                    <Button onClick={handlePrintLog} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Imprimer
                    </Button>
                    <Button onClick={handleClosePrintModal} variant="outlined" color="secondary" sx={{ mt: 2 }}>
                        Annuler
                    </Button>
                </Box>
            </Modal>
            <ToastContainer />
        </Box>
    );
};

export default AuditAdmin;


