import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { useState } from "react";

const Line = () => {
  const [selectedDate, setSelectedDate] = useState(null); // État pour gérer la date sélectionnée

  return (
    <Box m="20px">
      <Header title="GRAPHIQUE LINEAIRE" subtitle=" Suivi des Tendances avec un Graphique Linéaire" />
      <Box height="75vh">
        <LineChart selectedDate={selectedDate} />
      </Box>
    </Box>
  );
};

export default Line;
