import React, { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import axios from "axios";

const LineChart = ({ selectedDate }) => {
  const theme = useTheme();
  const colors = theme.palette.mode === "dark" ? {
    grey: {
      100: "#E0E0E0",
    },
    primary: {
      500: "#6200EA",
    },
  } : {
    grey: {
      100: "#424242",
    },
    primary: {
      500: "#6200EA",
    },
  };
  
  const [chartData, setChartData] = useState([]);

  const fetchChartData = async () => {
    try {
      const [ventesResponse, depensesResponse, revenusResponse, pertesResponse, beneficesResponse] = await Promise.all([
        axios.get(`http://localhost:5000/ventes/${selectedDate || ""}`),
        axios.get(`http://localhost:5000/depenses/${selectedDate || ""}`),
        axios.get(`http://localhost:5000/revenus/${selectedDate || ""}`),
        axios.get(`http://localhost:5000/pertes/${selectedDate || ""}`),
        axios.get(`http://localhost:5000/benefice/${selectedDate || ""}`)
      ]);

      // Formatage des données pour le graphique
      setChartData([
        {
          id: "Ventes",
          data: ventesResponse.data.map(item => ({
            x: item.date, // Assurez-vous que 'item.date' est correct
            y: item.totalVentes // Assurez-vous que 'item.totalVentes' est correct
          })),
        },
        {
          id: "Dépenses",
          data: depensesResponse.data.map(item => ({
            x: item.date,
            y: item.totalDepenses
          })),
        },
        {
          id: "Revenus",
          data: revenusResponse.data.map(item => ({
            x: item.date,
            y: item.revenuTotal
          })),
        },
        {
          id: "Pertes",
          data: pertesResponse.data.map(item => ({
            x: item.date,
            y: item.pertes
          })),
        },
        {
          id: "Bénéfice",
          data: beneficesResponse.data.map(item => ({
            x: item.date,
            y: item.benefice
          })),
        }
      ]);
    } catch (error) {
      console.error("Erreur lors de la récupération des données du graphique", error);
    }
  };

  useEffect(() => {
    if (selectedDate) { // Appelle fetchChartData uniquement si selectedDate est défini
      fetchChartData();
    }
  }, [selectedDate]);

  return (
    <ResponsiveLine
      data={chartData}
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
        legend: "Date",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Montant",
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
  );
};

export default LineChart;
