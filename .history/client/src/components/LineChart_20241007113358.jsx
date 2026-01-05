import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { fetchFinancialData } from "../data/mockData"; // Fetch financial data function
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify'; // For notifications

const LineChart = ({ date, isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      if (date) { // Check if a date is selected
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
          toast.error("Erreur lors de la récupération des données financières."); // Error notification
        }
      }
    };

    getData();
  }, [date]); // Add date as a dependency to fetch data when the date changes

  return (
    <>
      <ToastContainer /> {/* ToastContainer for notifications */}
      <ResponsiveLine
        data={lineData.length > 0 ? lineData : []} // Use fetched data or empty array
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
        colors={isCustomLineColors || isDashboard ? { datum: "color" } : { scheme: "nivo" }} // Conditional color scheme
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
        curve="catmullRom" // Smooth curve
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "Date", // Legend for X-axis
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickValues: 5,
          tickSize: 3,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "Valeur", // Legend for Y-axis
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
