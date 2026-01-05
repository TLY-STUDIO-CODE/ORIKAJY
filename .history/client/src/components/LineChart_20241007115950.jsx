import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { fetchFinancialData } from "../data/mockData"; 
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

const LineChart = ({ date, isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      if (date) {
        const financialData = await fetchFinancialData(date);
        if (financialData) {
          const formattedData = [
            {
              id: "dépenses",
              color: getColor(financialData.depenses),
              data: [{ x: date, y: financialData.depenses }],
            },
            {
              id: "bénéfice",
              color: getColor(financialData.benefice),
              data: [{ x: date, y: financialData.benefice }],
            },
            {
              id: "perte",
              color: getColor(financialData.pertes),
              data: [{ x: date, y: financialData.pertes }],
            },
          ];
          setLineData(formattedData);
        } else {
          toast.error("Erreur lors de la récupération des données financières.");
        }
      }
    };

    getData();
  }, [date]);

  const getColor = (value) => {
    if (value > 0) return tokens("dark").greenAccent[500]; // Couleur pour les valeurs positives
    if (value < 0) return tokens("dark").redAccent[200]; // Couleur pour les valeurs négatives
    return colors.grey[400]; // Couleur par défaut
  };

  return (
    <>
      <ToastContainer />
      <ResponsiveLine
        data={lineData.length > 0 ? lineData : []}
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
        colors={isCustomLineColors ? { datum: "color" } : { scheme: "nivo" }}
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
        curve="linear" // Utilisez "linear" pour une courbe moins marquée
        enablePoints={true}
        pointSize={8}
        pointColor={{ from: "serieColor" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        enableGridX={false}
        enableGridY={false}
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
        animate={true} // Activer l'animation
        motionConfig="wobbly" // Configurer le type d'animation
      />
    </>
  );
};

export default LineChart;
