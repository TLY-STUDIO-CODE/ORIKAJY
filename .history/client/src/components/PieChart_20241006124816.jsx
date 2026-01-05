import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [totalVentes, setTotalVentes] = useState(0);
  const [beneficeTotal, setBeneficeTotal] = useState(0);
  const [depenseTotal, setDepenseTotal] = useState(0);
  const [pertes, setPertes] = useState(0);
  const [revenuTotal, setRevenuTotal] = useState(0); // Ajout de l'état pour le revenu total

  // Fetch the data when component mounts
  useEffect(() => {
    getTolalVentes();
    getBeneficeTotal();
    getDepensesTotal();
    getPerteTotal();
    handleFetchRevenusTotal(); // Appel à la nouvelle fonction
  }, []);

  const getTolalVentes = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/ventes`);
      setTotalVentes(response.data.totalVentes);
    } catch (error) {
      toast.error("Erreur lors de la récupération des ventes.");
    }
  };

  const getBeneficeTotal = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/benefice`);
      setBeneficeTotal(response.data.benefice);
    } catch (error) {
      toast.error("Erreur lors de la récupération des revenus.");
    }
  };

  const getDepensesTotal = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/depenses`);
      setDepenseTotal(response.data.totalDepenses);
    } catch (error) {
      toast.error("Erreur lors de la récupération des dépenses.");
    }
  };

  const getPerteTotal = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/pertes`);
      setPertes(response.data.pertes);
    } catch (error) {
      toast.error("Erreur lors de la récupération des pertes.");
    }
  };

  // Nouvelle fonction pour récupérer les revenus totaux
  const handleFetchRevenusTotal = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/revenus`);
      setRevenuTotal(response.data.revenuTotal);
    } catch (error) {
      toast.error("Erreur lors de la récupération des revenus.");
    }
  };

  // Préparer les données dynamiques pour le diagramme en secteurs
  const data = [
    {
      id: "Ventes Totales",
      label: "Ventes Totales",
      value: totalVentes,
      color: "#f47560", // Couleur unique pour les ventes totales
    },
    {
      id: "Bénéfice",
      label: "Bénéfice",
      value: beneficeTotal,
      color: "#61cdbb", // Couleur unique pour le bénéfice
    },
    {
      id: "Dépenses",
      label: "Dépenses",
      value: depenseTotal,
      color: "#e8c1a0", // Couleur unique pour les dépenses
    },
    {
      id: "Pertes",
      label: "Pertes",
      value: pertes,
      color: "#97e3d5", // Couleur unique pour les pertes
    },
    {
      id: "Revenus Totaux",
      label: "Revenus Totaux",
      value: revenuTotal,
      color: "#ffcc00", // Couleur unique pour les revenus
    },
  ].filter(item => item.value > 0); // Filtrer les valeurs nulles

  return (
    <ResponsivePie
      data={data}
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
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={true} // Activer les étiquettes d'arc
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PieChart;
