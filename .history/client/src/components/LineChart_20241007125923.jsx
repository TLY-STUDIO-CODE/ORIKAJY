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
            basic: {
              fontSize: "14px",
              padding: "10px",
              borderRadius: "5px",
            },
          },
        }}
        colors={isCustomLineColors || isDashboard ? { datum: "color" } : { scheme: "nivo" }} // Conditional color scheme
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }} // Adjust for better date handling
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        yFormat=" >-.2f"
        curve="linear" // Changed to linear curve
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
        enableGridX={true} // Enable horizontal grid lines
        enableGridY={true} // Enable vertical grid lines
        pointSize={10} // Increase point size
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true} // Use mesh for better interaction
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
        animate={true} // Enable animation
        motionStiffness={90} // Animation stiffness
        motionDamping={15} // Animation damping
        enableArea={true} // Enable area under the line
        areaOpacity={0.1} // Opacity for area
        pointLabel="y" // Show Y value on hover
        enableSlices="x" // Enable vertical slices for hover effects
      />
    </>
  );
};

export default LineChart;
