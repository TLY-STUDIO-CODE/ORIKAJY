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
    const [selectedRowData, setSelectedRowData] = useState(null);

    const handleOpenModal = (rowData) => {
        setSelectedRowData(rowData); // Mettre à jour l'état avec les données de la ligne sélectionnée
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedRowData(null); // Réinitialiser les données après fermeture
    };

    const handleGenerateInvoice = () => {
        if (selectedRowData) {
            const doc = new jsPDF();
            // Titre de la facture
            doc.text("DONNEES DU REVENUS", 20, 10);
            doc.text(`Créé par: ${selectedRowData.createdBy}`, 20, 20);

            // Génération du PDF avec autoTable pour les données
            doc.autoTable({
                startY: 30,
                head: [['Description', 'Montant']],
                body: [
                    ['Total Ventes', `${selectedRowData.totalVentes} AR`],
                    ['Total Dépenses', `${selectedRowData.depenseTotal} AR`],
                    ['Revenu', `${selectedRowData.revenuTotal} AR`],
                    ['Pertes', `${selectedRowData.pertes} AR`],
                ]
            });

            // Sauvegarde du fichier PDF
            doc.save("revenu_report.pdf");
        }
    };


    const handleFetchRevenusTotal = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/revenus`);
            setRevenuTotal(response.data.revenuTotal);
            handleOpenModal(response.data); 
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
            handleOpenModal(response.data); 
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
            handleOpenModal(response.data); 
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
            handleOpenModal(response.data); 
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
    };

    return (
        <Box m="20px">
        <Header title="RAPPORTS" subtitle="Revenus, Ventes, Achats et Pertes" />
            
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
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        IMPRIMER LES DONNEES DU REVENUS
                    </Typography>

                    {/* Afficher les données dans le modal */}
                    {selectedRowData && (
                        <Box>
                            <Typography variant="body1">Total Ventes: {selectedRowData.totalVentes} AR</Typography>
                            <Typography variant="body1">Total Dépenses: {selectedRowData.depenseTotal} AR</Typography>
                            <Typography variant="body1">Revenu Total: {selectedRowData.revenuTotal} AR</Typography>
                            <Typography variant="body1">Pertes: {selectedRowData.pertes} AR</Typography>
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
                                    color="secondary"
                                >
                                    Obtenir Dépenses par Date
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={handleFetchDepensesTotal}
                                    variant="outlined"
                                    color="secondary"
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
                                    color="warning"
                                >
                                    Obtenir Perte par Date
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={handleFetchPerteTotal}
                                    variant="outlined"
                                    color="warning"
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
