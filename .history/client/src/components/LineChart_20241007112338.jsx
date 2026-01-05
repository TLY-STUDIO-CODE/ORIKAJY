import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { fetchFinancialData } from "../data/mockData";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify'; // Ajout pour la gestion des notifications

const LineChart = ({ date, isCustomLineColors = false, isDashboard = false  }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      if (date) { // Vérifiez si une date est sélectionnée
        const financialData = await fetchFinancialData(date);
        if (financialData) {
          const formattedData = [
            {
              id: "dépenses",
              color: tokens("dark").greenAccent[500],
              data: [{ x: date, y: financialData.depenses }],
            },
            {
              id: "bénéfice",
              color: tokens("dark").blueAccent[300],
              data: [{ x: date, y: financialData.benefice }],
            },
            {
              id: "perte",
              color: tokens("dark").redAccent[200],
              data: [{ x: date, y: financialData.pertes }],
            },
          ];
          setLineData(formattedData);
        } else {
          toast.error("Erreur lors de la récupération des données financières."); // Notification en cas d'erreur
        }
      }
    };

    getData();
  }, [date]); // Ajoutez date comme dépendance pour récupérer les données lorsque la date change

  return (
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
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
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
        legend: isDashboard ? undefined : "transportation", // added
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5, // added
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "count", // added
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
