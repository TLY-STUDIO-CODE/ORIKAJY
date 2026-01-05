// Line.js
import { Box, TextField } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { mockLineData } from "../../data/mockData"; // Importer la nouvelle fonction

const Line = () => {
  const [beneficeTotal, setBeneficeTotal] = useState(0);
  const [revenuTotal, setRevenuTotal] = useState(0);
  const [depenseTotal, setDepenseTotal] = useState(0);
  const [perteTotal, setPerteTotal] = useState(0);
  const [totalVentes, setTotalVentes] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState([]);

  const handleFetchData = async () => {
    try {
      const [beneficeRes, revenuRes, depenseRes, perteRes, venteRes] = await Promise.all([
        axios.get(`http://localhost:5000/benefice?date=${selectedDate}`),
        axios.get(`http://localhost:5000/revenus?date=${selectedDate}`),
        axios.get(`http://localhost:5000/depenses?date=${selectedDate}`),
        axios.get(`http://localhost:5000/pertes?date=${selectedDate}`),
        axios.get(`http://localhost:5000/ventes?date=${selectedDate}`),
      ]);

      setBeneficeTotal(beneficeRes.data.benefice);
      setRevenuTotal(revenuRes.data.revenuTotal);
      setDepenseTotal(depenseRes.data.totalDepenses);
      setPerteTotal(perteRes.data.pertes);
      setTotalVentes(venteRes.data.totalVentes);
    } catch (error) {
      toast.error("Erreur lors de la récupération des données.");
    }
  };

  useEffect(() => {
    handleFetchData();
  }, [selectedDate]);

  useEffect(() => {
    // Utiliser les données récupérées pour mettre à jour les données du graphique
    setData(mockLineData(selectedDate, beneficeTotal, revenuTotal, depenseTotal, perteTotal, totalVentes));
  }, [beneficeTotal, revenuTotal, depenseTotal, perteTotal, totalVentes, selectedDate]);

  return (
    <Box m="20px">
      <Header title="GRAPHIQUE LINEAIRE" subtitle="Suivi des Tendances avec un Graphique Linéaire" />
      <TextField
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Box height="75vh">
        <LineChart data={data} />
      </Box>
    </Box>
  );
};

export default Line;


