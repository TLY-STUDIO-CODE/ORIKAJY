import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LineChart = ({ date, isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // States pour les données
  const [lineData, setLineData] = useState([]);
  const [beneficeTotal, setBeneficeTotal] = useState(0);
  const [revenuTotal, setRevenuTotal] = useState(0);
  const [totalVentes, setTotalVentes] = useState(0);
  const [depenseTotal, setDepenseTotal] = useState(0);
  const [pertes, setPertes] = useState(0);

  // Fonction pour récupérer les données financières
  const fetchFinancialData = async (date) => {
    try {
      const response = await axios.get(`http://localhost:5000/financialData`, { params: { date } });
      return response.data; // Assurez-vous que la structure des données est correcte
    } catch (error) {
      toast.error("Erreur lors de la récupération des données financières.");
      return null;
    }
  };

  // Fetch functions pour les totaux
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

  // Effectuer des appels pour récupérer des données
  useEffect(() => {
    if (date) {
      const getData = async () => {
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
          ];
          setLineData(formattedData);
          toast.success("Données récupérées avec succès !");
        } else {
          toast.error("Aucune donnée disponible pour la date sélectionnée.");
        }
      };
      getData();
    }

    // Appels pour les totaux
    handleFetchBeneficeTotal();
    handleFetchRevenusTotal();
    handleFetchTotalVentes();
    handleFetchDepensesTotal();
    handleFetchPerteTotal();
  }, [date]); // Ajouter `date` comme dépendance

  // Préparer les données pour le graphique
  const chartData = [
    {
      id: "Bénéfice",
      data: [{ x: "Total", y: beneficeTotal }],
    },
    {
      id: "Revenus",
      data: [{ x: "Total", y: revenuTotal }],
    },
    {
      id: "Ventes",
      data: [{ x: "Total", y: totalVentes }],
    },
    {
      id: "Dépenses",
      data: [{ x: "Total", y: depenseTotal }],
    },
    {
      id: "Pertes",
      data: [{ x: "Total", y: pertes }],
    },
  ];

  return (
    <>
      <ToastContainer />
      <ResponsiveLine
        data={lineData.length > 0 ? lineData : chartData} // Utiliser lineData si disponible, sinon utiliser chartData
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
        colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        yFormat=" >-.2f"
        curve="catmullRom"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "Catégories",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickValues: 5,
          tickSize: 3,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "Valeur",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        enableGridX={false}
        enableGridY={false}
        pointSize={8}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
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
            itemOpacity: 0.75,
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
      />
    </>
  );
};

export default LineChart;
