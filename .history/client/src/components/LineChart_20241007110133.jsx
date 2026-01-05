import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { fetchFinancialData } from "../data/mockData";
import React, { useEffect, useState } from "react";

const LineChart = ({ date, isCustomLineColors = false, isDashboard = false }) => {
 const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    const getData = async () => {
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
      colors={isCustomLineColors ? { datum: "color" } : undefined}
      // Ajoutez d'autres propriétés si nécessaire
    />
  );
};

export default LineChart;