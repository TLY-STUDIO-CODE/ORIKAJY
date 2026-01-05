import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { fetchFinancialData } from "../data/mockData"; // Fonction pour récupérer les données financières
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify'; // Pour les notifications
import 'react-toastify/dist/ReactToastify.css'; // Styles des notifications
import axios from "axios";
const LineChart = ({ date, isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
   // States to hold data
  const [beneficeTotal, setBeneficeTotal] = useState(0);
  const [revenuTotal, setRevenuTotal] = useState(0);
  const [totalVentes, setTotalVentes] = useState(0);
  const [depenseTotal, setDepenseTotal] = useState(0);
  const [pertes, setPertes] = useState(0);
  // Fetch functions
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

  const handleFetchTotalVentes = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/ventes`);
      setTotalVentes(response.data.totalVentes);
    } catch (error) {
      toast.error("Erreur lors de la récupération des ventes.");
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
      setPertes(response.data.pertes);
    } catch (error) {
      toast.error("Erreur lors de la récupération des pertes.");
    }
  };

  // UseEffect to call the fetch functions
  useEffect(() => {
    handleFetchBeneficeTotal();
    handleFetchRevenusTotal();
    handleFetchTotalVentes();
    handleFetchDepensesTotal();
    handleFetchPerteTotal();
  }, []);
  const chartData = [
    {
      id: "Bénéfice",
      color: tokens("dark").greenAccent[500],
      data: [{ x: "Total", y: beneficeTotal }],
    },
    {
      id: "Revenus",
      color: tokens("dark").redAccent[400],
      data: [{ x: "Total", y: revenuTotal }],
    },
    {
      id: "Ventes",
      color: tokens("dark").greenAccent[300],
      data: [{ x: "Total", y: totalVentes }],
    },
    {
      id: "Dépenses",
      color: tokens("dark").greenAccent[500],
      data: [{ x: "Total", y: depenseTotal }],
    },
    {
      id: "Pertes",
      color: tokens("dark").redAccent[200],
      data: [{ x: "Total", y: pertes }],
    },
  ];

  const [lineData, setLineData] = useState([]);
  useEffect(() => {
    const getData = async () => {
      if (date) { // Vérifier si une date est sélectionnée
        try {
          const financialData = await fetchFinancialData(date);
          
          if (financialData) {
            const formattedData = [
              {
                id: "Dépenses",
                color: tokens("dark").greenAccent[500],
                data: [{ x: date, y: financialData.depenses }],
              },
              {
                id: "Bénéfice",
                color: tokens("dark").blueAccent[300],
                data: [{ x: date, y: financialData.benefice }],
              },
              {
                id: "Perte",
                color: tokens("dark").redAccent[200],
                data: [{ x: date, y: financialData.pertes }],
              },
               // Ajout des totaux par date
          
            ];
            setLineData(formattedData);
            toast.success("Données récupérées avec succès !"); // Notification de succès
          } else {
            toast.error("Aucune donnée disponible pour la date sélectionnée."); // Notification d'erreur
          }
        } catch (error) {
          toast.error("Erreur lors de la récupération des données financières."); // Notification d'erreur
        }
      }
    };

    getData();
  }, [date]); // Ajouter `date` comme dépendance pour mettre à jour les données quand la date change

  return (
    <>
      <ToastContainer /> {/* Container pour les notifications */}
     <ResponsiveLine
  data={lineData.length > 0 ? lineData : chartData} // Vos données (chaque point avec un jour et un montant)
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
        backgroundColor: colors.primary[500],
        color: '#fff',
        borderRadius: '5px',
        padding: '10px',
      },
    },
  }}
  colors={isCustomLineColors || isDashboard ? { datum: "color" } : { scheme: "nivo" }} // Couleurs personnalisées
  margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
  
  // Échelle pour l'axe des X (jours du mois, de 1 à 31)
  xScale={{
    type: "linear",
    min: 0,  // Jour minimum
    max: 31, // Jour maximum
    stacked: false,  // Pas de stacking des lignes
    reverse: false,
  }}
  
  // Échelle pour l'axe des Y (montants)
  yScale={{
    type: "linear",
    min: "auto", // Ajustement automatique du minimum
    max: "auto", // Ajustement automatique du maximum
    stacked: false,
    reverse: false,
  }}
  
  yFormat=" >-.2f" // Format des valeurs sur l'axe Y (montants)
  curve="catmullRom" // Lignes lissées pour une meilleure lisibilité
  axisTop={null}
  axisRight={null}
  
  // Configuration de l'axe des X (jours du mois)
  axisBottom={{
    orient: "bottom",
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: "Jour du mois", // Légende pour l'axe X
    legendOffset: 36,
    legendPosition: "middle",
  }}

  // Configuration de l'axe des Y (montants)
  axisLeft={{
    orient: "left",
    tickValues: 5, // Nombre de ticks sur l'axe Y
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: "Montant (€)", // Légende pour l'axe Y
    legendOffset: -40,
    legendPosition: "middle",
  }}
  
  enableGridX={true}  // Activer les lignes de grille horizontales
  enableGridY={true}  // Activer les lignes de grille verticales
  pointSize={10}      // Taille des points
  pointColor={{ theme: "background" }}
  pointBorderWidth={2}
  pointBorderColor={{ from: "serieColor" }} // Utilisation de la couleur de la série pour les points
  pointLabelYOffset={-12}
  useMesh={true}      // Activer la détection des points pour les survols (tooltips)

  legends={[
    {
      anchor: "bottom-right",
      direction: "column",
      justify: false,
      translateX: 100,
      translateY: 0,
      itemsSpacing: 0,
      itemDirection: "left-to-right",
      itemWidth: 80,
      itemHeight: 20,
      itemOpacity: 0.85,
      symbolSize: 12,
      symbolShape: "circle",
      symbolBorderColor: "rgba(0, 0, 0, .5)",
      effects: [
        {
          on: "hover",
          style: {
            itemBackground: "rgba(0, 0, 0, .03)",
            itemOpacity: 1,
          },
        },
      ],
    },
  ]}
  
  animate={true}          // Activer les animations
  motionStiffness={90}     // Rigidité de l'animation
  motionDamping={15}       // Amortissement de l'animation
/>
    </>
  );
};

export default LineChart;
