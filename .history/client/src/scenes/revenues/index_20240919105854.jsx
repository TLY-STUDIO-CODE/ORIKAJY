import React, { useState, useEffect } from 'react';
import { Box, useTheme, Typography, Button, TextField, Grid, Card, CardContent } from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
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
                            color="warning"
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
                                    color="error"
                                >
                                    Obtenir Perte par Date
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={handleFetchPerteTotal}
                                    variant="outlined"
                                    color="error"
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
