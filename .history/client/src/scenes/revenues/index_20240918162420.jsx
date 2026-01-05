import React, { useEffect, useState } from 'react';
import { Box, useTheme, Typography, Button, TextField } from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Revenues = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedDate, setSelectedDate] = useState("");
  const [revenuTotal, setRevenuTotal] = useState(0);
  const [totalVentes, setTotalVentes] = useState(0);
  const [depenseTotal, setDepenseTotal] = useState(0);

  useEffect(() => {
    // Initial fetch can be done here if needed
  }, []);

  const handleFetchRevenusByDate = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/revenus/${selectedDate}`);
      setRevenuTotal(response.data.revenuTotal);
    } catch (error) {
      toast.error("Erreur lors de la récupération des revenus pour la date spécifiée.");
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

  const handleFetchDepensesTotal = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/depenses/${selectedDate}`);
      setDepenseTotal(response.data.depenseTotal);
    } catch (error) {
      toast.error("Erreur lors de la récupération des depenses pour la date spécifiée.");
    }
  };

  return (
    <Box m="20px">
      <Typography variant="h4">Revenus, Ventes et Achats</Typography>
      
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
          onClick={handleFetchDepensesTotal}
          variant="contained"
          color="success"
          sx={{ ml: 2 }}
        >
          Obtenir Total Achats
        </Button>
      </Box>

      <Box mt="20px">
        <Typography variant="h6">Revenu Total: {revenuTotal} AR</Typography>
        <Typography variant="h6">Total Ventes: {totalVentes} AR</Typography>
        <Typography variant="h6">Total Achats: {depenseTotal} AR</Typography>
      </Box>

      <ToastContainer />
    </Box>
  );
};

export default Revenues;
