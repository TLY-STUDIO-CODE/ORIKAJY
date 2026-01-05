import React, { useEffect, useState } from "react";
import axios from "axios";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching data from the backend
        const depensesResponse = await axios.get("http://localhost:5000/depenses");
        const beneficeResponse = await axios.get("http://localhost:5000/benefice");
        const pertesResponse = await axios.get("http://localhost:5000/pertes");

        // Transforming the data into the required structure
        const transformedData = [
          {
            id: "dépenses",
            color: tokens("dark").greenAccent[500],
            data: depensesResponse.data.map(item => ({
              x: item.date,  // Assuming item.date is a field in the response
              y: item.totalDepenses,  // Adjust based on your response structure
            })),
          },
          {
            id: "bénéfice",
            color: tokens("dark").blueAccent[300],
            data: beneficeResponse.data.map(item => ({
              x: item.date,  // Assuming item.date is a field in the response
              y: item.benefice,  // Adjust based on your response structure
            })),
          },
          {
            id: "perte",
            color: tokens("dark").redAccent[200],
            data: pertesResponse.data.map(item => ({
              x: item.date,  // Assuming item.date is a field in the response
              y: item.pertes,  // Adjust based on your response structure
            })),
          },
        ];

        // Set the transformed data
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveLine
      data={data}
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
      // Add other necessary props for ResponsiveLine as required
    />
  );
};

export default LineChart;
