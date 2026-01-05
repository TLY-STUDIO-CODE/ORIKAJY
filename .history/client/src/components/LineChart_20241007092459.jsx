import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import axios from "axios"; // Assurez-vous d'importer axios

const LineChart = ({ isCustomLineColors = false, isDashboard = false, selectedDate }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // État pour stocker les données récupérées
  const [chartData, setChartData] = useState([]);

  // Fonction pour récupérer toutes les données nécessaires
  const fetchData = async () => {
    try {
      const [beneficeResponse, depenseResponse, perteResponse, revenuResponse, venteResponse] = await Promise.all([
        axios.get(`http://localhost:5000/benefice`),
        axios.get(`http://localhost:5000/depenses`),
        axios.get(`http://localhost:5000/pertes`),
        axios.get(`http://localhost:5000/revenus`),
        axios.get(`http://localhost:5000/ventes`),
      ]);

      // Préparez les données pour le graphique
      setChartData([
        {
          id: "Bénéfice",
          data: beneficeResponse.data.benefice.map(item => ({ x: item.date, y: item.amount })),
        },
        {
          id: "Dépense",
          data: depenseResponse.data.totalDepenses.map(item => ({ x: item.date, y: item.amount })),
        },
        {
          id: "Perte",
          data: perteResponse.data.pertes.map(item => ({ x: item.date, y: item.amount })),
        },
        {
          id: "Revenu",
          data: revenuResponse.data.revenuTotal.map(item => ({ x: item.date, y: item.amount })),
        },
        {
          id: "Vente",
          data: venteResponse.data.totalVentes.map(item => ({ x: item.date, y: item.amount })),
        },
      ]);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  // Appeler la fonction fetchData lors du montage du composant
  useEffect(() => {
    fetchData();
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
        legend: isDashboard ? undefined : "transportation",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "count",
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

