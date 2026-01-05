import React, { useState, useEffect } from "react";
import axios from "axios";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LineChart = ({ date, isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // States to hold the financial data
  const [financialData, setFinancialData] = useState({
    beneficeTotal: 0,
    revenuTotal: 0,
    totalVentes: 0,
    depenseTotal: 0,
    pertes: 0,
  });

  // Generic fetch function
  const fetchData = async (endpoint, key) => {
    try {
      const response = await axios.get(`http://localhost:5000/${endpoint}`);
      setFinancialData((prevData) => ({
        ...prevData,
        [key]: response.data[key],
      }));
    } catch (error) {
      toast.error(`Erreur lors de la récupération des ${key}.`);
    }
  };

  // UseEffect to fetch all data at once
  useEffect(() => {
    fetchData("benefice", "beneficeTotal");
    fetchData("revenus", "revenuTotal");
    fetchData("ventes", "totalVentes");
    fetchData("depenses", "depenseTotal");
    fetchData("pertes", "pertes");
  }, []);

  // Format line data for chart
  const chartData = [
    {
      id: "Bénéfice",
      color: tokens("dark").greenAccent[500],
      data: [{ x: "Total", y: financialData.beneficeTotal }],
    },
    {
      id: "Revenus",
      color: tokens("dark").redAccent[400],
      data: [{ x: "Total", y: financialData.revenuTotal }],
    },
    {
      id: "Ventes",
      color: tokens("dark").greenAccent[300],
      data: [{ x: "Total", y: financialData.totalVentes }],
    },
    {
      id: "Dépenses",
      color: tokens("dark").greenAccent[500],
      data: [{ x: "Total", y: financialData.depenseTotal }],
    },
    {
      id: "Pertes",
      color: tokens("dark").redAccent[200],
      data: [{ x: "Total", y: financialData.pertes }],
    },
  ];

  const [lineData, setLineData] = useState([]);

  // Fetch data by date
  useEffect(() => {
    const fetchDateData = async () => {
      if (date) {
        try {
          const response = await axios.get(`http://localhost:5000/financialData/${date}`);
          const { depenses, benefice, pertes } = response.data;
          
          const formattedData = [
            {
              id: "Dépenses",
              color: tokens("dark").greenAccent[500],
              data: [{ x: date, y: depenses }],
            },
            {
              id: "Bénéfice",
              color: tokens("dark").blueAccent[300],
              data: [{ x: date, y: benefice }],
            },
            {
              id: "Pertes",
              color: tokens("dark").redAccent[200],
              data: [{ x: date, y: pertes }],
            },
          ];
          setLineData(formattedData);
          toast.success("Données récupérées avec succès !");
        } catch (error) {
          toast.error("Erreur lors de la récupération des données pour la date sélectionnée.");
        }
      }
    };

    fetchDateData();
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
                fontSize: 12,
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
                fontSize: 10,
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
              fontSize: 12,
            },
          },
          tooltip: {
            container: {
              backgroundColor: colors.primary[500],
              color: "#fff",
              borderRadius: "5px",
              padding: "10px",
            },
          },
        }}
        colors={isCustomLineColors || isDashboard ? { datum: "color" } : { scheme: "nivo" }}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", stacked: true }}
        curve="catmullRom"
        axisBottom={{
          orient: "bottom",
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "Date",
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
        enableGridX={true}
        enableGridY={true}
        pointSize={8}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            translateX: 100,
            itemWidth: 80,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: "circle",
          },
        ]}
        animate={true}
      />
    </>
  );
};

export default LineChart;
