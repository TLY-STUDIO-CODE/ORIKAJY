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
    const [beneficeByDate, setBeneficeByDate] = useState(0);

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
                axios.get(`http://localhost:5000/pertes/${selectedDate || ""}`),
                axios.get(`http://localhost:5000/benefice/${selectedDate || ""}`)
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

    const handleFetchBeneficeTotal = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/benefice`);
            setBeneficeTotal(response.data.benefice);
        } catch (error) {
            toast.error("Erreur lors de la récupération des bénéfices.");
        }
    };

    const handleFetchBeneficeByDate = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/benefice/${selectedDate}`);
            setBeneficeByDate(response.data.benefice);
        } catch (error) {
            toast.error("Erreur lors de la récupération des bénéfices pour la date spécifiée.");
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
        setBeneficeByDate(0);
        setBeneficeTotal(0);
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
                            variant="contained"
                            color="primary"
                            onClick={fetchAllData}
                        >
                            Générer Rapport
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">
                                Total Ventes
                            </Typography>
                            <Typography variant="h5" color="primary">
                                {totalVentes} AR
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">
                                Total Dépenses
                            </Typography>
                            <Typography variant="h5" color="primary">
                                {depenseTotal} AR
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">
                                Revenu Total
                            </Typography>
                            <Typography variant="h5" color="primary">
                                {revenuTotal} AR
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">
                                Bénéfice Total
                            </Typography>
                            <Typography variant="h5" color="primary">
                                {beneficeTotal} AR
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">
                                Pertes Totales
                            </Typography>
                            <Typography variant="h5" color="primary">
                                {pertes} AR
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Modal */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{ ...theme.modalStyle }}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        Rapport Complet
                    </Typography>
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        <p><strong>Total Ventes:</strong> {allData?.totalVentes || 0} AR</p>
                        <p><strong>Total Dépenses:</strong> {allData?.depenseTotal || 0} AR</p>
                        <p><strong>Revenu Total:</strong> {allData?.revenuTotal || 0} AR</p>
                        <p><strong>Bénéfice Total:</strong> {allData?.beneficeTotal || 0} AR</p>
                        <p><strong>Pertes Totales:</strong> {allData?.pertes || 0} AR</p>
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PrintIcon />}
                        onClick={handleGenerateInvoice}
                    >
                        Télécharger PDF
                    </Button>
                </Box>
            </Modal>

            <ToastContainer />
        </Box>
    );
};

export default Revenues;
