import React, { useState, useEffect } from 'react';
import { Box, useTheme, Typography, Button, TextField, Grid, Card, CardContent, Modal } from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';
import Header from "../../components/Header";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import PrintIcon from "@mui/icons-material/Print";

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
    const [openModal, setOpenModal] = useState(false);
    const [allData, setAllData] = useState(null);

    // Fonction pour ouvrir le modal avec les données
    const handleOpenModal = (data) => {
        setAllData(data);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setAllData(null);
    };

    // Fonction pour générer le PDF
    const handleGenerateInvoice = () => {
        if (allData) {
            const doc = new jsPDF();
            doc.text("DONNEES DU RAPPORT", 20, 10);
            doc.text(`Date: ${selectedDate || "Toutes les dates"}`, 20, 20);

            doc.autoTable({
                startY: 30,
                head: [['Description', 'Montant']],
                body: [
                    ['Total Ventes', `${allData.totalVentes || 0} AR`],
                    ['Total Dépenses', `${allData.depenseTotal || 0} AR`],
                    ['Revenu Total', `${allData.revenuTotal || 0} AR`],
                    ['Benefice Total', `${allData.beneficeTotal || 0} AR`],
                    ['Pertes Totales', `${allData.pertes || 0} AR`],
                ]
            });

            doc.save("rapport_complet.pdf");
        }
    };

    // Fonction pour récupérer toutes les données
    const fetchAllData = async () => {
        try {
            const [ventesResponse, depensesResponse, revenusResponse, pertesResponse, beneficesResponse] = await Promise.all([
                axios.get(`http://localhost:5000/ventes/${selectedDate || ""}`),
                axios.get(`http://localhost:5000/depenses/${selectedDate || ""}`),
                axios.get(`http://localhost:5000/revenus/${selectedDate || ""}`),
                axios.get(`http://localhost:5000/benefice/${selectedDate || ""}`),
                axios.get(`http://localhost:5000/pertes/${selectedDate || ""}`)
            ]);

            const data = {
                totalVentes: ventesResponse.data.totalVentes,
                depenseTotal: depensesResponse.data.totalDepenses,
                revenuTotal: revenusResponse.data.revenuTotal,
                beneficeTotal: beneficesResponse.data.beneficeTotal,
                pertes: pertesResponse.data.pertes,
            };

            handleOpenModal(data);
        } catch (error) {
            toast.error("Erreur lors de la récupération des données.");
        }
    };

    const handleReset = () => {
        setSelectedDate("");
        setAllData(null);
    };

    return (
        <Box m="20px">
            <Header title="FINANCIERS" subtitle="Rapports sur les Ventes, les Achats, les Revenus et Pertes" />
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
                variant="outlined"
                startIcon={<PrintIcon />}
                color="secondary"
                sx={{ mb: 3, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
            >
                Obtenir et Imprimer le Rapport
            </Button>

            {/* Modal pour afficher les données */}
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

                    {allData && (
                        <Box>
                            <Typography variant="body1">Total Ventes: {allData.totalVentes} AR</Typography>
                            <Typography variant="body1">Total Dépenses: {allData.depenseTotal} AR</Typography>
                            <Typography variant="body1">Revenu Total: {allData.revenuTotal} AR</Typography>
                            <Typography variant="body1">Benefice Total: {allData.beneficeTotal} AR</Typography>
                            <Typography variant="body1">Perte Totale: {allData.pertes} AR</Typography>
                        </Box>
                    )}

                    <Button onClick={handleGenerateInvoice} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Imprimer
                    </Button>
                </Box>
            </Modal>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Ventes</Typography>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Ventes:</Typography>
                            <Typography variant="body1">{allData ? allData.totalVentes : 'N/A'} AR</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Dépenses</Typography>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Dépenses:</Typography>
                            <Typography variant="body1">{allData ? allData.depenseTotal : 'N/A'} AR</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Revenues;
