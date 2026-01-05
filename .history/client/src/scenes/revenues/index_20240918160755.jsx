import React, { useEffect, useState } from 'react';
import { Box, useTheme, Typography, Button, Modal, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RevenusVentesAchat = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [revenus, setRevenus] = useState([]);
  const [ventes, setVentes] = useState([]);
  const [achats, setAchats] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [revenuTotal, setRevenuTotal] = useState(0);
  const [totalVentes, setTotalVentes] = useState(0);
  const [totalAchats, setTotalAchats] = useState(0);

  useEffect(() => {
    fetchAllRevenus();
    fetchTotalVentes();
    fetchTotalAchats();
  }, []);

  const fetchAllRevenus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/');
      setRevenus(response.data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des revenus.");
    }
  };

  const fetchTotalVentes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/ventes');
      setVentes(response.data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des ventes.");
    }
  };

  const fetchTotalAchats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/achats');
      setAchats(response.data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des achats.");
    }
  };

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

  const handleFetchTotalAchats = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/achats/${selectedDate}`);
      setTotalAchats(response.data.totalAchats);
    } catch (error) {
      toast.error("Erreur lors de la récupération des achats pour la date spécifiée.");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Nom", flex: 1 },
    { field: "montant_total", headerName: "Montant Total", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
  ];

  const rows = revenus.map((revenu, index) => ({
    id: index + 1,
    ...revenu
  }));

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
          onClick={handleFetchTotalAchats}
          variant="contained"
          color="success"
          sx={{ ml: 2 }}
        >
          Obtenir Total Achats
        </Button>
      </Box>

      <Box mt="20px" height="400px">
        <DataGrid 
          rows={rows} 
          columns={columns} 
          pageSize={10} 
          components={{ Toolbar: GridToolbar }} 
        />
      </Box>

      <Box mt="20px">
        <Typography variant="h6">Revenu Total: {revenuTotal} AR</Typography>
        <Typography variant="h6">Total Ventes: {totalVentes} AR</Typography>
        <Typography variant="h6">Total Achats: {totalAchats} AR</Typography>
      </Box>

      <ToastContainer />
    </Box>
  );
};

export default RevenusVentesAchat;
