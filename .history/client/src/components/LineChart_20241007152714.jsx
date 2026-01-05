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
  const [pertes, setPertesTotal] = useState(0);
  const [lineData, setLineData] = useState([]);

  // Fetch functions
  const fetchData = async (endpoint, setState, errorMessage) => {
    try {
      const response = await axios.get(`http://localhost:5000/${endpoint}`);
      setState(response.data);
    } catch (error) {
      toast.error(errorMessage);
    }
  };

  // UseEffect to call the fetch functions
  useEffect(() => {
    fetchData("benefice", setBeneficeTotal, "Erreur lors de la récupération des bénéfices.");
    fetchData("revenus", setRevenuTotal, "Erreur lors de la récupération des revenus.");
    fetchData("ventes", setTotalVentes, "Erreur lors de la récupération des ventes.");
    fetchData("depenses", setDepenseTotal, "Erreur lors de la récupération des dépenses.");
    fetchData("pertes", setPertesTotal, "Erreur lors de la récupération des pertes.");
  }, []);

  const chartData = [
    {
      id: "Bénéfice",
      color: tokens("dark").blueAccent[300],
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

  useEffect(() => {
    const getData = async () => {
      if (date) {
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
            ];
            setLineData(formattedData);
            toast.success("Données récupérées avec succès !");
          } else {
            toast.error("Aucune donnée disponible pour la date sélectionnée.");
          }
        } catch (error) {
          toast.error("Erreur lors de la récupération des données financières.");
        }
      }
    };

    getData();
  }, [date]);

  return (
    <>
      <ToastContainer />
      <ResponsiveLine
        data={lineData.length > 0 ? lineData : chartData}
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
        colors={isCustomLineColors || isDashboard ? { datum: "color" } : { scheme: "nivo" }}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{
          type: "linear",
          min: 0,
          max: 31, // Échelle de 0 à 31 jours
        }}
        yScale={{
          type: "linear",
          min: 0,
          max: 500000000, // Échelle de 0 à 500.000.000 Ar
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
          legend: isDashboard ? undefined : "Jour de l'année",
          legendOffset: 36,
          legendPosition: "middle",
          tickValues: Array.from({ length: 32 }, (_, i) => i), // Jours de 0 à 31
        }}
        axisLeft={{
          orient: "left",
          tickValues: 5,
          tickSize: 3,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "Montant (Ar)",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        enableGridX={true}
        enableGridY={true}
        pointSize={10}
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
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </>
  );
};

export default LineChart;
