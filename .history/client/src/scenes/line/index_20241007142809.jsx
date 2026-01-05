import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import React, { useState } from "react";

const Line = () => {
  // État pour la date sélectionnée
  const [selectedDate, setSelectedDate] = useState("");

  // Gestionnaire de changement de date
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <Box m="20px">
      <Header title="GRAPHIQUE LINEAIRE" subtitle="Suivi des Tendances avec un Graphique Linéaire" />
      {/* Champ de formulaire pour la sélection de la date */}
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        style={{ marginBottom: '20px', padding: '8px', borderRadius: '4px' }}
      />
      <Box height="75vh">
        {/* Transmettez la date au composant LineChart */}
        <LineChart date={selectedDate} />
      </Box>
    </Box>
  );
};

export default Line;

