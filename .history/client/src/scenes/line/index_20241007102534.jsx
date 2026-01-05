import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { useEffect, useState } from "react"; // Importer useEffect et useState
import axios from "axios"; // Importer axios
import { tokens } from "../../theme";
const Line = () => {
  const [data, setData] = useState([]); // État pour stocker les données

  useEffect(() => {
    const fetchData = async ({ data }) => {
      console.log("Données pour LineChart:", data);
  try {
    const response = await axios.get('http://localhost:5000/benefice');
    console.log("Données récupérées:", response.data); // Ajoutez cette ligne
    const transformedData = transformData(response.data);
    setData(transformedData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


    fetchData();
  }, []);

  const transformData = (data) => {
    // Transformation des données pour le graphique
    return [
      {
        id: "ventes",
        color: tokens("dark").greenAccent[500],
        data: data.ventes.map(item => ({
          x: item.date, // Assurez-vous que l'item a une propriété date
          y: item.montant_total,
        })),
      },
      {
        id: "achats",
        color: tokens("dark").blueAccent[300],
        data: data.achats.map(item => ({
          x: item.date,
          y: item.montant_total,
        })),
      },
    ];
  };

  return (
    <Box m="20px">
      <Header title="GRAPHIQUE LINEAIRE" subtitle="Suivi des Tendances avec un Graphique Linéaire" />
      <Box height="75vh">
        <LineChart data={data} /> {/* Passer les données récupérées ici */}
      </Box>
    </Box>
  );
};

export default Line;
