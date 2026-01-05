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
  const [lineData, setLineData] = useState([]);
   // Nouveaux états pour les totaux
  const [totalDepenses, setDepenseTotal] = useState(0);
  const [totalVentes, setTotalVentes] = useState(0);
  const [totalBenefice, setBeneficeTotal] = useState(0);
  const [totalRevenu, setRevenuTotal] = useState(0);
  const [totalPertes, setPertes] = useState(0);
useEffect(() => {
    const fetchTotals = async () => {
      try {
        // Récupération des totaux depuis les différentes routes
        const depenseResponse = await axios.get("http://localhost:5000/depenses");
        const venteResponse = await axios.get("http://localhost:5000/ventes");
        const beneficeResponse = await axios.get("http://localhost:5000/benefice");
        const revenuResponse = await axios.get("http://localhost:5000/revenus");
        const perteResponse = await axios.get("http://localhost:5000/pertes");

        setDepenseTotal(depenseResponse.data.totalDepenses || 0);
        setTotalVentes(venteResponse.data.totalVentes || 0);
        setBeneficeTotal(beneficeResponse.data.benefice || 0);
        setRevenuTotal(revenuResponse.data.revenuTotal || 0);
        setPertes(perteResponse.data.pertes || 0);

        toast.success("Totaux récupérés avec succès !");
      } catch (error) {
        toast.error("Erreur lors de la récupération des totaux.");
        console.error(error);
      }
    };

    fetchTotals();
  }, []);

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
              {
                id: "Total Dépenses",
                color: tokens("dark").greenAccent[100],
                data: [{ x: date, y: totalDepenses }],
              },
              {
                id: "Total Ventes",
                color: tokens("dark").blueAccent[100],
                data: [{ x: date, y: totalVentes }],
              },
              {
                id: "Total Bénéfice",
                color: tokens("dark").blueAccent[200],
                data: [{ x: date, y: totalBenefice }],
              },
              {
                id: "Total Revenu",
                color: tokens("dark").yellowAccent[100],
                data: [{ x: date, y: totalRevenu }],
              },
              {
                id: "Total Pertes",
                color: tokens("dark").redAccent[100],
                data: [{ x: date, y: totalPertes }],
              }
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
  }, [date, totalDepenses, totalVentes, totalBenefice, totalRevenu, totalPertes]); // Ajouter `date` comme dépendance pour mettre à jour les données quand la date change

  return (
    <>
      <ToastContainer /> {/* Container pour les notifications */}
      <div>
        {/* Affichage des totaux */}
        <h3>Total Dépenses: {totalDepenses} Ar</h3>
        <h3>Total Ventes: {totalVentes} Ar</h3>
        <h3>Total Bénéfice: {totalBenefice} Ar</h3>
        <h3>Total Revenu: {totalRevenu} Ar</h3>
        <h3>Total Pertes: {totalPertes} Ar</h3>
      </div>
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
              backgroundColor: colors.primary[500], // Couleur de fond de l'info-bulle
              color: '#fff', // Texte blanc pour l'info-bulle
              borderRadius: '5px',
              padding: '10px',
            },
          },
        }}
        colors={isCustomLineColors || isDashboard ? { datum: "color" } : { scheme: "nivo" }} // Couleurs personnalisées ou par défaut
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        yFormat=" >-.2f" // Format des valeurs en axe Y
        curve="catmullRom" // Courbe lissée
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "Date", // Légende pour l'axe X
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickValues: 5,
          tickSize: 3,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "Valeur", // Légende pour l'axe Y
          legendOffset: -40,
          legendPosition: "middle",
        }}
        enableGridX={true} // Activer les lignes de grille horizontales
        enableGridY={true} // Activer les lignes de grille verticales
        pointSize={10} // Augmenter la taille des points
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true} // Activer la détection des points pour les survols
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
        animate={true} // Activer les animations
        motionStiffness={90} // Rigidité de l'animation
        motionDamping={15} // Amortissement de l'animation
      />
    </>
  );
};

export default LineChart;
