import { Box, TextField } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Line = () => {
  const [beneficeTotal, setBeneficeTotal] = useState(0);
  const [revenuTotal, setRevenuTotal] = useState(0);
  const [depenseTotal, setDepenseTotal] = useState(0);
  const [perteTotal, setPerteTotal] = useState(0);
  const [totalVentes, setTotalVentes] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Format YYYY-MM-DD
  const [data, setData] = useState([]); // Pour les données du graphique

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
    // Format des données pour le graphique
    setData([
      {
        id: "Dépense",
        data: [{ x: selectedDate, y: depenseTotal }],
      },
      {
        id: "Bénéfice",
        data: [{ x: selectedDate, y: beneficeTotal }],
      },
      {
        id: "Perte",
        data: [{ x: selectedDate, y: perteTotal }],
      },
      {
        id: "Revenu",
        data: [{ x: selectedDate, y: revenuTotal }],
      },
      {
        id: "Vente",
        data: [{ x: selectedDate, y: totalVentes }],
      },
    ]);
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

