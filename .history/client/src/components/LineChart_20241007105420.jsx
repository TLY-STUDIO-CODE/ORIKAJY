import { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { mockLineData as data } from "../data/mockData";
import axios from "axios"; // Assurez-vous d'installer axios

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // État pour la date sélectionnée
  const [selectedDate, setSelectedDate] = useState("");
  const [lineData, setLineData] = useState(data); // Utilisez des données initiales

  // Gestionnaire d'événements pour changer la date
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // Fonction pour récupérer les données par date
  const fetchDataByDate = async () => {
    if (selectedDate) {
      try {
        const response = await axios.get(`/api/depenses/${selectedDate}`); // Ajustez l'URL selon votre backend
        const totalDepenses = response.data.totalDepenses;

        // Mettez à jour les données de la ligne en fonction de la réponse
        const updatedData = [
          {
            id: "dépenses",
            color: tokens("dark").greenAccent[500],
            data: [{ x: selectedDate, y: totalDepenses }],
          },
          // Vous pouvez également mettre à jour les autres séries de données ici
        ];

        setLineData(updatedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    }
  };

  useEffect(() => {
    fetchDataByDate(); // Appel initial pour récupérer les données à la date sélectionnée
  }, [selectedDate]);

  return (
    <div>
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
      />
      <ResponsiveLine
        data={lineData}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
          tooltip: {
            container: {
              color: colors.primary[500],
            },
          },
        }}
        colors={isDashboard ? { datum: "color" } : undefined}
        // Ajoutez d'autres propriétés nécessaires pour votre graphique
      />
    </div>
  );
};

export default LineChart;
