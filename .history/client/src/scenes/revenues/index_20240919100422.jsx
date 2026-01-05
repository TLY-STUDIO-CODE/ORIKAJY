import React, { useState, useEffect } from 'react';
import { Box, useTheme, Typography, Button, TextField } from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';

const Revenues = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError } = useSelector((state => state.auth));

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
    const [totalVentes, setTotalVentes] = useState(0);
    const [depenseTotal, setDepenseTotal] = useState(0);
    const [depenseByDate, setDepenseByDate] = useState(0);
    const [pertes, setPertes] = useState(0);
    const [pertesByDate, setPertesByDate] = useState(0); 

    // Fonction pour récupérer les revenus totaux
    const handleFetchRevenusTotal = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/revenus`);
            setRevenuTotal(response.data.revenuTotal);
        } catch (error) {
            toast.error("Erreur lors de la récupération des revenus.");
        }
    };

    const handleFetchTotalVentes = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/ventes/${selectedDate}`);
            setTotalVentes(response.data.totalVentes);
        } catch (error) {
            toast.error("Erreur lors de la récupération des ventes pour la date spécifiée.");
        }
    };

    // Fonction pour récupérer les revenus pour une date spécifique
    const handleFetchRevenusByDate = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/revenus/${selectedDate}`);
            setRevenuByDate(response.data.revenuTotal);
        } catch (error) {
            toast.error("Erreur lors de la récupération des revenus pour la date spécifiée.");
        }
    };

    // Fonction pour récupérer les dépenses totales
    const handleFetchDepensesTotal = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/depenses`);
            setDepenseTotal(response.data.totalDepenses);
        } catch (error) {
            toast.error("Erreur lors de la récupération des dépenses.");
        }
    };

    // Fonction pour récupérer les dépenses pour une date spécifique
    const handleFetchDepensesByDate = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/depenses/${selectedDate}`);
            setDepenseByDate(response.data.totalDepenses);
        } catch (error) {
            toast.error("Erreur lors de la récupération des dépenses pour la date spécifiée.");
        }
    };

    // Fonction pour récupérer la perte totale
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
        setPertesByDate(response.data.pertes);  // Correction : Accéder à 'pertes'
    } catch (error) {
        toast.error("Erreur lors de la récupération des pertes pour la date spécifiée.");
    }
};

    // Fonction pour réinitialiser les champs
    const handleReset = () => {
        setSelectedDate("");
        setRevenuTotal(0);
        setRevenuByDate(0);
        setTotalVentes(0);
        setDepenseTotal(0);
        setDepenseByDate(0);
        setPertes(0);
        setPertesByDate(0);
    };

    return (
        <Box m="20px">
            <Typography variant="h4">Revenus, Ventes, Achats et Pertes</Typography>
            
            <Box mt="20px">
                <TextField
                    label="Date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <Button
                    onClick={handleFetchTotalVentes}
                    variant="outlined"
                    color="success"
                    sx={{ ml: 2 }}
                >
                    Obtenir Total Ventes par Date
                </Button>
                <Button
                    onClick={handleFetchDepensesByDate}
                    variant="outlined"
                    color="secondary"
                    sx={{ ml: 2 }}
                >
                    Obtenir Dépenses par Date
                </Button>
                <Button
                    onClick={handleFetchDepensesTotal}
                    variant="outlined"
                    color="secondary"
                    sx={{ ml: 2 }}
                >
                    Obtenir Dépenses Totaux
                </Button>
                <Button
                    onClick={handleFetchRevenusByDate}
                    variant="outlined"
                    color="info"
                    sx={{ ml: 2 }}
                >
                    Obtenir Revenu par Date
                </Button>
                <Button
                    onClick={handleFetchRevenusTotal}
                    variant="outlined"
                    color="info"
                    sx={{ ml: 2 }}
                >
                    Obtenir Revenu Total
                </Button>
                <Button
                    onClick={handleFetchPertesByDate}
                    variant="outlined"
                    color="error"
                    sx={{ ml: 2 }}
                >
                    Obtenir Perte par Date
                </Button>
                <Button
                    onClick={handleFetchPerteTotal}
                    variant="outlined"
                    color="error"
                    sx={{ ml: 2 }}
                >
                    Obtenir Perte Totale
                </Button>
                <Button
                    onClick={handleReset}
                    variant="outlined"
                    color="error"
                    sx={{ ml: 2 }}
                >
                    Réinitialiser
                </Button>
            </Box>

            <Box mt="20px">
                <Typography variant="h6">Total Ventes par date: {totalVentes} AR</Typography>
                <Typography variant="h6">Total Achats par date: {depenseByDate} AR</Typography>
                <Typography variant="h6">Total Achats: {depenseTotal} AR</Typography>
                <Typography variant="h6">Total Revenu par date: {revenuByDate} AR</Typography>
                <Typography variant="h6">Total Revenu: {revenuTotal} AR</Typography>
                <Typography variant="h6">Total Perte par date: {pertesByDate} AR</Typography>
                <Typography variant="h6">Total Perte: {pertes} AR</Typography>
            </Box>

            <ToastContainer />
        </Box>
    );
};

export default Revenues;

