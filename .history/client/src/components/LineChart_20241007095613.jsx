import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Assuming you are using react-toastify for notifications

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [lineData, setLineData] = useState([]);

  const handleFetchData = async () => {
    try {
      const [beneficeResponse, revenusResponse, depensesResponse] = await Promise.all([
        axios.get(`http://localhost:5000/benefice`),
        axios.get(`http://localhost:5000/revenus`),
        axios.get(`http://localhost:5000/depenses`),
      ]);

      setLineData([
        {
          id: "Bénéfice",
          color: tokens("dark").greenAccent[500],
          data: beneficeResponse.data.benefice.map((item, index) => ({
            x: `Item ${index + 1}`, // Adjust as necessary
            y: item,
          })),
        },
        {
          id: "Revenus",
          color: tokens("dark").blueAccent[500],
          data: revenusResponse.data.revenuTotal.map((item, index) => ({
            x: `Item ${index + 1}`, // Adjust as necessary
            y: item,
          })),
        },
        {
          id: "Dépenses",
          color: tokens("dark").redAccent[500],
          data: depensesResponse.data.totalDepenses.map((item, index) => ({
            x: `Item ${index + 1}`, // Adjust as necessary
            y: item,
          })),
        },
      ]);
    } catch (error) {
      toast.error("Erreur lors de la récupération des données.");
    }
  };

  useEffect(() => {
    handleFetchData();
  }, []);

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
        legend: isDashboard ? undefined : "Item", // added
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5, // added
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Valeur", // added
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
