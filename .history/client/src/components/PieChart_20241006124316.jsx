import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [totalVentes, setTotalVentes] = useState(0);
  const [beneficeTotal, setBeneficeTotal] = useState(0);
  const [depenseTotal, setDepenseTotal] = useState(0);
  const [pertes, setPertes] = useState(0);

  // Fetch the data when component mounts
  useEffect(() => {
    getTolalVentes();
    getBeneficeTotal();
    getDepensesTotal();
    getPerteTotal();
  }, []);

  const getTolalVentes = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/ventes`);
      setTotalVentes(response.data.totalVentes);
    } catch (error) {
      toast.error("Erreur lors de la récupération des ventes.");
    }
  };

  const getBeneficeTotal = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/benefice`);
      setBeneficeTotal(response.data.benefice);
    } catch (error) {
      toast.error("Erreur lors de la récupération des bénéfices.");
    }
  };

  const getDepensesTotal = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/depenses`);
      setDepenseTotal(response.data.totalDepenses);
    } catch (error) {
      toast.error("Erreur lors de la récupération des dépenses.");
    }
  };

  const getPerteTotal = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/pertes`);
      setPertes(response.data.pertes);
    } catch (error) {
      toast.error("Erreur lors de la récupération des pertes.");
    }
  };

  // Prepare the dynamic data for the pie chart
  const data = [
    {
      id: "Ventes Totales",
      label: `Ventes Totales: ${totalVentes}`,
      value: totalVentes,
      color: "#f47560",
    },
    {
      id: "Bénéfice",
      label: `Bénéfice: ${beneficeTotal}`,
      value: beneficeTotal,
      color: "#61cdbb",
    },
    {
      id: "Dépenses",
      label: `Dépenses: ${depenseTotal}`,
      value: depenseTotal,
      color: "#e8c1a0",
    },
    {
      id: "Pertes",
      label: `Pertes: ${pertes}`,
      value: pertes,
      color: "#97e3d5",
    },
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
      enableArcLabels={true}  // Enable arc labels to show values
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
