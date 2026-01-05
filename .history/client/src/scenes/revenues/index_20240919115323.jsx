import React, { useState, useEffect } from 'react';
import { Box, useTheme, Typography, Button, TextField, Grid, Card, CardContent, Modal } from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import jsPDF from "jspdf";  // Importation de jsPDF
import 'jspdf-autotable';  // Pour la génération automatique de tables
import PrintIcon from "@mui/icons-material/Print";
import { getMe } from '../../features/authSlice';
import Header from "../../components/Header";

const Revenues = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate("/");
        }
    }, [isError, navigate]);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [selectedDate, setSelectedDate] = useState("");
    const [revenuTotal, setRevenuTotal] = useState(0);
    const [revenuByDate, setRevenuByDate] = useState(0);
    const [totalVenteByDate, setTotalVenteByDate] = useState(0);
    const [totalVentes, setTotalVentes] = useState(0);
    const [depenseTotal, setDepenseTotal] = useState(0);
    const [depenseByDate, setDepenseByDate] = useState(0);
    const [pertes, setPertes] = useState(0);
    const [pertesByDate, setPertesByDate] = useState(0);

    // Pour l'affichage du modal
    const [openModal, setOpenModal] = useState(false);
    const [allData, setAllData] = useState(null);

    const handleOpenModal = (data) => {
        setAllData(data);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setAllData(null);
    };

    const handleGenerateInvoice = () => {
        if (allData) {
            const doc = new jsPDF();
            // Titre du document
            doc.text("DONNEES DU RAPPORT", 20, 10);
            doc.text(`Date: ${selectedDate || "Toutes les dates"}`, 20, 20);

            // Génération du PDF avec autoTable pour les données
            doc.autoTable({
                startY: 30,
                head: [['Description', 'Montant']],
                body: [
                    ['Total Ventes', `${allData.totalVentes || 0} AR`],
                    ['Total Dépenses', `${allData.depenseTotal || 0} AR`],
                    ['Revenu Total', `${allData.revenuTotal || 0} AR`],
                    ['Pertes Totales', `${allData.pertes || 0} AR`],
                ]
            });

            // Sauvegarde du fichier PDF
            doc.save("rapport_complet.pdf");
        }
    };

    const fetchAllData = async () => {
        try {
            const [ventesResponse, depensesResponse, revenusResponse, pertesResponse] = await Promise.all([
                axios.get(`http://localhost:5000/ventes/${selectedDate || ""}`),
                axios.get(`http://localhost:5000/depenses/${selectedDate || ""}`),
                axios.get(`http://localhost:5000/revenus/${selectedDate || ""}`),
                axios.get(`http://localhost:5000/pertes/${selectedDate || ""}`)
            ]);

            const data = {
                totalVentes: ventesResponse.data.totalVentes,
                depenseTotal: depensesResponse.data.totalDepenses,
                revenuTotal: revenusResponse.data.revenuTotal,
                pertes: pertesResponse.data.pertes,
            };

            handleOpenModal(data);
        } catch (error) {
            toast.error("Erreur lors de la récupération des données.");
        }
    };

    const handleReset = () => {
        setSelectedDate("");
        setRevenuTotal(0);
        setRevenuByDate(0);
        setTotalVentes(0);
        setTotalVenteByDate(0);
        setDepenseTotal(0);
        setDepenseByDate(0);
        setPertes(0);
        setPertesByDate(0);
    };

    return (
        <Box m="20px">
            <Header title="RAPPORTS" subtitle="Revenus, Ventes, Dépenses et Pertes" />

            <Box mb="20px">
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Date"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button
                            onClick={handleReset}
                            variant="outlined"
                            color="error"
                            fullWidth
                        >
                            Réinitialiser
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Button
                onClick={fetchAllData}
                variant="contained"
                color="primary"
                startIcon={<PrintIcon />}
                sx={{ mb: 3 }}
            >
                Obtenir et Imprimer le Rapport
            </Button>

            {/* Modal pour afficher et imprimer les données */}
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
                    <Typography variant="h6">
                        RAPPORT COMPLET
                    </Typography>

                    {/* Afficher les données dans le modal */}
                    {allData && (
                        <Box>
                            <Typography variant="body1">Total Ventes: {allData.totalVentes} AR</Typography>
                            <Typography variant="body1">Total Dépenses: {allData.depenseTotal} AR</Typography>
                            <Typography variant="body1">Revenu Total: {allData.revenuTotal} AR</Typography>
                            <Typography variant="body1">Pertes Totales: {allData.pertes} AR</Typography>
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

export default Revenues;
