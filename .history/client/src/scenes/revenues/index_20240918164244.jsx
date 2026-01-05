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
    const [totalVentes, setTotalVentes] = useState(0);
    const [depenseTotal, setDepenseTotal] = useState(0);
    const [revenuTotalByDate, setRevenuTotalByDate] = useState(0);
    const [depenseTotalByDate, setDepenseTotalByDate] = useState(0);

    // Fonction pour récupérer les revenus pour une date spécifique
    const handleFetchRevenusByDate = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/revenus/${selectedDate}`);
            setRevenuTotalByDate(response.data.revenuTotal);
        } catch (error) {
            toast.error("Erreur lors de la récupération des revenus pour la date spécifiée.");
        }
    };

    // Fonction pour récupérer le total des ventes pour une date spécifique
    const handleFetchTotalVentes = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/ventes/${selectedDate}`);
            setTotalVentes(response.data.totalVentes);
        } catch (error) {
            toast.error("Erreur lors de la récupération des ventes pour la date spécifiée.");
        }
    };

    // Fonction pour récupérer les dépenses pour une date spécifique
    const handleFetchDepensesByDate = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/depenses/${selectedDate}`);
            setDepenseTotalByDate(response.data.totalDepenses);
        } catch (error) {
            toast.error("Erreur lors de la récupération des dépenses pour la date spécifiée.");
        }
    };

    // Fonction pour récupérer le total des revenus
    const handleFetchRevenuTotal = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/revenus/total`);
            setRevenuTotal(response.data.totalRevenu);
        } catch (error) {
            toast.error("Erreur lors de la récupération du total des revenus.");
        }
    };

    // Fonction pour récupérer le total des dépenses
    const handleFetchDepenseTotal = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/depenses/total`);
            setDepenseTotal(response.data.totalDepenses);
        } catch (error) {
            toast.error("Erreur lors de la récupération du total des dépenses.");
        }
    };

    return (
        <Box m="20px">
            <Typography variant="h4">Revenus, Ventes et Dépenses</Typography>
            
            <Box mt="20px">
                <TextField
                    label="Date"
                    type="date"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <Button
                    onClick={handleFetchRevenusByDate}
                    variant="contained"
                    color="primary"
                    sx={{ ml: 2 }}
                >
                    Obtenir Revenus par Date
                </Button>
                <Button
                    onClick={handleFetchTotalVentes}
                    variant="contained"
                    color="secondary"
                    sx={{ ml: 2 }}
                >
                    Obtenir Total Ventes
                </Button>
                <Button
                    onClick={handleFetchDepensesByDate}
                    variant="contained"
                    color="success"
                    sx={{ ml: 2 }}
                >
                    Obtenir Dépenses par Date
                </Button>
                <Button
                    onClick={handleFetchRevenuTotal}
                    variant="contained"
                    color="info"
                    sx={{ ml: 2 }}
                >
                    Obtenir Total Revenus
                </Button>
                <Button
                    onClick={handleFetchDepenseTotal}
                    variant="contained"
                    color="warning"
                    sx={{ ml: 2 }}
                >
                    Obtenir Total Dépenses
                </Button>
            </Box>

            <Box mt="20px">
                <Typography variant="h6">Revenu Total: {revenuTotal} AR</Typography>
                <Typography variant="h6">Revenu Total par Date: {revenuTotalByDate} AR</Typography>
                <Typography variant="h6">Total Ventes: {totalVentes} AR</Typography>
                <Typography variant="h6">Total Dépenses par Date: {depenseTotalByDate} AR</Typography>
                <Typography variant="h6">Total Dépenses: {depenseTotal} AR</Typography>
            </Box>

            <ToastContainer />
        </Box>
    );
};

export default Revenues;

