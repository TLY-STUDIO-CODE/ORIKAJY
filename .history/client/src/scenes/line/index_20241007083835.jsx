import { Box, TextField, Button } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { useState } from "react";

const Line = () => {
  const [selectedDate, setSelectedDate] = useState("");

  // Fonction pour gérer la sélection de date
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <Box m="20px">
      <Header title="GRAPHIQUE LINEAIRE" subtitle="Suivi des Tendances avec un Graphique Linéaire" />
      
      {/* Ajout d'un champ de saisie pour sélectionner une date */}
      <Box mb={2}>
        <TextField
          type="date"
          label="Sélectionner une date"
          value={selectedDate}
          onChange={handleDateChange}
          variant="outlined"
        />
      </Box>

      {/* Bouton pour déclencher la récupération des données */}
      <Box mb={2}>
        <Button variant="contained" color="primary" onClick={() => fetchAllData(selectedDate)}>
          Charger les données
        </Button>
      </Box>

      <Box height="75vh">
        <LineChart selectedDate={selectedDate} />
      </Box>
    </Box>
  );
};

export default Line;

