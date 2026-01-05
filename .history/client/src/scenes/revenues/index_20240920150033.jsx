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
import jsPDF from "jspdf";  // Importation de jsPDF
import 'jspdf-autotable';  // Pour la génération automatique de tables
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
    const [revenuTotal, setRevenuTotal] = useState(0);
    const [revenuByDate, setRevenuByDate] = useState(0);
    const [totalVenteByDate, setTotalVenteByDate] = useState(0);
    const [totalVentes, setTotalVentes] = useState(0);
    const [depenseTotal, setDepenseTotal] = useState(0);
    const [depenseByDate, setDepenseByDate] = useState(0);
    const [pertes, setPertes] = useState(0);
    const [pertesByDate, setPertesByDate] = useState(0);
    const [beneficeTotal, setBeneficeTotal] = useState(0);
    const [totalBeneficeByDate, setTotalBeneficeByDate] = useState(0);

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
                    ['Benefice Total', `${allData.beneficeTotal || 0} AR`],
                    ['Pertes Totales', `${allData.pertes || 0} AR`],
                ]
            });

            // Sauvegarde du fichier PDF
            doc.save("rapport_complet.pdf");
        }
    };

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

    const handleFetchBeneficesTotal = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/benefice`);
            setBeneficeTotal(response.data.beneficeTotal);
        } catch (error) {
            toast.error("Erreur lors de la récupération des revenus.");
        }
    };

    const handleFetchTotalBeneficeByDate = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/benefice/${selectedDate}`);
            setTotalBeneficeByDate(response.data.totalBenefice);
        } catch (error) {
            toast.error("Erreur lors de la récupération des ventes pour la date spécifiée.");
        }
    };

    const handleFetchRevenusTotal = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/revenus`);
            setRevenuTotal(response.data.revenuTotal);
        } catch (error) {
            toast.error("Erreur lors de la récupération des revenus.");
        }
    };

    const handleFetchTotalVentesByDate = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/ventes/${selectedDate}`);
            setTotalVenteByDate(response.data.totalVentes);
        } catch (error) {
            toast.error("Erreur lors de la récupération des ventes pour la date spécifiée.");
        }
    };

    const handleFetchTotalVentes = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/ventes`);
            setTotalVentes(response.data.totalVentes);
        } catch (error) {
            toast.error("Erreur lors de la récupération des ventes.");
        }
    };

    const handleFetchRevenusByDate = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/revenus/${selectedDate}`);
            setRevenuByDate(response.data.revenuTotal);
        } catch (error) {
            toast.error("Erreur lors de la récupération des revenus pour la date spécifiée.");
        }
    };

    const handleFetchDepensesTotal = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/depenses`);
            setDepenseTotal(response.data.totalDepenses);
        } catch (error) {
            toast.error("Erreur lors de la récupération des dépenses.");
        }
    };

    const handleFetchDepensesByDate = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/depenses/${selectedDate}`);
            setDepenseByDate(response.data.totalDepenses);
        } catch (error) {
            toast.error("Erreur lors de la récupération des dépenses pour la date spécifiée.");
        }
    };

    const handleFetchPerteTotal = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/pertes`);
            setPertes(response.data.pertes);
        } catch (error) {
            toast.error("Erreur lors de la récupération des pertes.");
        }
    };

    const handleFetchPertesByDate = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/pertes/${selectedDate}`);
            setPertesByDate(response.data.pertes);
        } catch (error) {
            toast.error("Erreur lors de la récupération des pertes pour la date spécifiée.");
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
        setTotalBeneficeByDate(0);
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
                            sx={{
                                '& .MuiInputBase-root': {
                                    height: '100%',
                                },
                                '& .MuiInputLabel-root': {
                                    height: '100%',
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button
                            onClick={handleReset}
                            variant="outlined"
                            color="error"
                            fullWidth
                            sx={{
                                height: '100%',
                            }}
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
                sx={{
                    mb: 3,
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
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
                            <Typography variant="body1">Benefice Totale: {allData.beneficeTotal} AR</Typography>
                            <Typography variant="body1">Perte Totale: {allData.pertes} AR</Typography>
                        </Box>
                    )}

                    <Button onClick={handleGenerateInvoice} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Imprimer
                    </Button>
                </Box>
            </Modal>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                <Typography variant="h6">Ventes</Typography>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Ventes par date:</Typography>
                            <Typography variant="body1">{totalVenteByDate} AR</Typography>
                            <Typography variant="h6">Total Ventes:</Typography>
                            <Typography variant="body1">{totalVentes} AR</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                <Typography variant="h6">Dépenses</Typography>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Dépenses par date:</Typography>
                            <Typography variant="body1">{depenseByDate} AR</Typography>
                            <Typography variant="h6">Total Dépenses:</Typography>
                            <Typography variant="body1">{depenseTotal} AR</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Vente Buttons */}
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Button
                                    onClick={handleFetchTotalVentesByDate}
                                    variant="outlined"
                                    color="success"
                                >
                                    Obtenir Total Ventes par Date
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={handleFetchTotalVentes}
                                    variant="outlined"
                                    color="success"
                                >
                                    Obtenir Ventes Totaux
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                     {/* Dépenses Buttons */}
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Button
                                    onClick={handleFetchDepensesByDate}
                                    variant="outlined"
                                    color="success"
                                >
                                    Obtenir Dépenses par Date
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={handleFetchDepensesTotal}
                                    variant="outlined"
                                    color="success"
                                >
                                    Obtenir Dépenses Totaux
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                <Grid item xs={12} md={6}>
                <Typography variant="h6">Revenus</Typography>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Revenu par date:</Typography>
                            <Typography variant="body1">{revenuByDate} AR</Typography>
                            <Typography variant="h6">Revenu Total:</Typography>
                            <Typography variant="body1">{revenuTotal} AR</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                <Typography variant="h6">Pertes</Typography>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Pertes par date:</Typography>
                            <Typography variant="body1">{pertesByDate} AR</Typography>
                            <Typography variant="h6">Pertes Totales:</Typography>
                            <Typography variant="body1">{pertes} AR</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                 {/* Revenus Buttons */}
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Button
                                    onClick={handleFetchRevenusByDate}
                                    variant="outlined"
                                    color="info"
                                >
                                    Obtenir Revenu par Date
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={handleFetchRevenusTotal}
                                    variant="outlined"
                                    color="info"
                                >
                                    Obtenir Revenu Total
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    
                    {/* Pertes Buttons */}
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Button
                                    onClick={handleFetchPertesByDate}
                                    variant="outlined"
                                    color="info"
                                >
                                    Obtenir Perte par Date
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={handleFetchPerteTotal}
                                    variant="outlined"
                                    color="info"
                                >
                                    Obtenir Perte Totale
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
            </Grid>
            
            <ToastContainer />
        </Box>
    );
};

export default Revenues;
