import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart2 from "../../components/LineChart2";

const Line2 = () => {
  return (
    <Box m="20px">
       <Header title="GRAPHIQUE LINÉAIRE" subtitle="Suivi des rapports financiers avec un Graphique Linéaire" />
      <Box height="75vh">
        <LineChart2 />
      </Box>
    </Box>
  );
};

export default Line2;
