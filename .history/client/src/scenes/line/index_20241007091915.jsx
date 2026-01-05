import { Box } from "@mui/material";
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

  const handleFetchBeneficeTotal = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/benefice`);
      setBeneficeTotal(response.data.benefice);
    } catch (error) {
      toast.error("Erreur lors de la récupération des revenus.");
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

  const handleFetchDepensesTotal = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/depenses`);
      setDepenseTotal(response.data.totalDepenses);
    } catch (error) {
      toast.error("Erreur lors de la récupération des dépenses.");
    }
  };

  const handleFetchPerteTotal = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/pertes`);
      setPerteTotal(response.data.pertes);
    } catch (error) {
      toast.error("Erreur lors de la récupération des pertes.");
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

  const fetchAllData = () => {
    handleFetchBeneficeTotal();
    handleFetchRevenusTotal();
    handleFetchDepensesTotal();
    handleFetchPerteTotal();
    handleFetchTotalVentes();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

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
      <Header title="GRAPHIQUE LINEAIRE" subtitle=" Suivi des Tendances avec un Graphique Linéaire" />
      <Box height="75vh">
        <LineChart data={data} />
      </Box>
    </Box>
  );
};

export default Line;
