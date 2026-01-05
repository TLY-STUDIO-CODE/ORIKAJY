import { useEffect, useState } from "react"; // Assurez-vous d'importer useEffect et useState
import axios from "axios"; // Assurez-vous d'importer axios
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Définition des états pour les données
  const [beneficeTotal, setBeneficeTotal] = useState(0);
  const [revenuTotal, setRevenuTotal] = useState(0);
  const [totalVentes, setTotalVentes] = useState(0);
  const [depenseTotal, setDepenseTotal] = useState(0);
  const [perteTotal, setPerteTotal] = useState(0);

  // Fonctions pour récupérer les données
  const handleFetchBeneficeTotal = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/benefice`);
      setBeneficeTotal(response.data.benefice);
    } catch (error) {
      toast.error("Erreur lors de la récupération des revenus.");
    }
  };

  const handleFetchRevenusTotal = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/revenus`);
      setRevenuTotal(response.data.revenuTotal);
    } catch (error) {
      toast.error("Erreur lors de la récupération des revenus.");
    }
  };

  const handleFetchTotalVentes = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/ventes`);
      setTotalVentes(response.data.totalVentes);
    } catch (error) {
      toast.error("Erreur lors de la récupération des ventes.");
    }
  };

  const handleFetchDepensesTotal = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/depenses`);
      setDepenseTotal(response.data.totalDepenses);
    } catch (error) {
      toast.error("Erreur lors de la récupération des dépenses.");
    }
  };

  const handleFetchPerteTotal = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/pertes`);
      setPerteTotal(response.data.pertes);
    } catch (error) {
      toast.error("Erreur lors de la récupération des pertes.");
    }
  };

  // Utiliser useEffect pour appeler les fonctions de récupération de données lors du premier rendu
  useEffect(() => {
    handleFetchBeneficeTotal();
    handleFetchRevenusTotal();
    handleFetchTotalVentes();
    handleFetchDepensesTotal();
    handleFetchPerteTotal();
  }, []);

  // Préparez les données pour le graphique
  const data = [
    {
      id: "Bénéfice",
      data: [{ x: "Total", y: beneficeTotal }],
    },
    {
      id: "Revenus",
      data: [{ x: "Total", y: revenuTotal }],
    },
    {
      id: "Ventes",
      data: [{ x: "Total", y: totalVentes }],
    },
    {
      id: "Dépenses",
      data: [{ x: "Total", y: depenseTotal }],
    },
    {
      id: "Pertes",
      data: [{ x: "Total", y: perteTotal }],
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
        legend: isDashboard ? undefined : "Categories", // Ajout d'une légende
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Montant", // Ajout d'une légende
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
