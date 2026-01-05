import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // États pour stocker les données des différents types
  const [totalVentes, setTotalVentes] = useState(0);
  const [beneficeTotal, setBeneficeTotal] = useState(0);
  const [depenseTotal, setDepenseTotal] = useState(0);
  const [pertes, setPertes] = useState(0);
  const [revenuTotal, setRevenuTotal] = useState(0);

  // Récupération des données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ventesResponse = await axios.get(`http://localhost:5000/ventes`);
        setTotalVentes(ventesResponse.data.totalVentes);

        const beneficeResponse = await axios.get(`http://localhost:5000/benefice`);
        setBeneficeTotal(beneficeResponse.data.benefice);

        const depenseResponse = await axios.get(`http://localhost:5000/depenses`);
        setDepenseTotal(depenseResponse.data.totalDepenses);

        const pertesResponse = await axios.get(`http://localhost:5000/pertes`);
        setPertes(pertesResponse.data.pertes);

        const revenuResponse = await axios.get(`http://localhost:5000/revenus`);
        setRevenuTotal(revenuResponse.data.revenuTotal);
      } catch (error) {
        toast.error("Erreur lors de la récupération des données.");
      }
    };
    fetchData();
  }, []);

  // Données pour le graphique en fonction des montants récupérés
  const data = [
    { id: "Ventes", label: "Ventes", value: totalVentes, color: colors.redAccent[500] },
    { id: "Bénéfice", label: "Bénéfice", value: beneficeTotal, color: colors.greenAccent[500] },
    { id: "Dépenses", label: "Dépenses", value: depenseTotal, color: colors.blueAccent[500] },
    { id: "Pertes", label: "Pertes", value: pertes, color: colors.yellowAccent[500] },
    { id: "Revenus", label: "Revenus", value: revenuTotal, color: colors.purpleAccent[500] },
  ];

  return (
    <ResponsivePie
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
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={true}
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PieChart;

