// Line.js
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import axios from "axios";
import Header from "../../components/Header";
import ChartLine from "../../components/ChartLine";

const Line = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/rapport");
      const ventes = response.data.ventes.map((vente) => ({
        x: vente.date_vente,
        y: vente.montant_vente,
      }));

      const depenses = response.data.depenses.map((depense) => ({
        x: depense.date_achat,
        y: depense.montant_achat,
      }));

      const revenus = response.data.revenus.map((revenu) => ({
        x: revenu.date_transaction,
        y: revenu.montant_transaction,
      }));

      setData([
        { id: "Ventes", color: "hsl(220, 70%, 50%)", data: ventes },
        { id: "Dépenses", color: "hsl(120, 70%, 50%)", data: depenses },
        { id: "Revenus", color: "hsl(60, 70%, 50%)", data: revenus },
      ]);
    } catch (error) {
      console.error("Erreur lors de la récupération des données", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box m="20px">
      <Header title="GRAPHIQUE LINEAIRE" subtitle="Suivi des Tendances avec un Graphique Linéaire" />
      <Box height="75vh">
        <ChartLine data={data} />
      </Box>
    </Box>
  );
};

export default Line;

