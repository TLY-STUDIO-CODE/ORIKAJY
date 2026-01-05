import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const LineChart = ({ selectedDate, isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [beneficeByDate, setBeneficeByDate] = useState(0);
  const [totalVenteByDate, setTotalVenteByDate] = useState(0);
  const [revenuByDate, setRevenuByDate] = useState(0);
  const [pertesByDate, setPertesByDate] = useState(0);
  const [depenseByDate, setDepenseByDate] = useState(0);

  // Fetch the data when selectedDate changes
  useEffect(() => {
    handleFetchBeneficeByDate();
    handleFetchTotalVentesByDate();
    handleFetchRevenusByDate();
    handleFetchPertesByDate();
    handleFetchDepensesByDate(); // Ajoutez cette fonction pour récupérer les dépenses
  }, [selectedDate]);

  const handleFetchBeneficeByDate = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/benefice/${selectedDate}`);
      setBeneficeByDate(response.data.benefice);
    } catch (error) {
      toast.error("Erreur lors de la récupération des bénéfices pour la date spécifiée.");
    }
  };

  const handleFetchTotalVentesByDate = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/ventes/${selectedDate}`);
      setTotalVenteByDate(response.data.totalVentes);
    } catch (error) {
      toast.error("Erreur lors de la récupération des ventes pour la date spécifiée.");
    }
  };

  const handleFetchRevenusByDate = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/revenus/${selectedDate}`);
      setRevenuByDate(response.data.revenuTotal);
    } catch (error) {
      toast.error("Erreur lors de la récupération des revenus pour la date spécifiée.");
    }
  };

  const handleFetchPertesByDate = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/pertes/${selectedDate}`);
      setPertesByDate(response.data.pertes);
    } catch (error) {
      toast.error("Erreur lors de la récupération des pertes pour la date spécifiée.");
    }
  };

  const handleFetchDepensesByDate = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/depenses/${selectedDate}`);
      setDepenseByDate(response.data.totalDepenses); // Assurez-vous que votre API retourne bien totalDepenses
    } catch (error) {
      toast.error("Erreur lors de la récupération des dépenses pour la date spécifiée.");
    }
  };

  // Prepare data for the line chart
  const data = [
    {
      id: "Bénéfice",
      data: [{ x: selectedDate, y: beneficeByDate }],
    },
    {
      id: "Ventes Totales",
      data: [{ x: selectedDate, y: totalVenteByDate }],
    },
    {
      id: "Revenus",
      data: [{ x: selectedDate, y: revenuByDate }],
    },
    {
      id: "Pertes",
      data: [{ x: selectedDate, y: pertesByDate }],
    },
    {
      id: "Dépenses",
      data: [{ x: selectedDate, y: depenseByDate }],
    },
  ];

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
        legend: isDashboard ? undefined : "Montant",
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
