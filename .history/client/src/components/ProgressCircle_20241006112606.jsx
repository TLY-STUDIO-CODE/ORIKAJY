import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useState } from "react";

const ProgressCircle = ({ progress = 0, size = "40" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${progress === 1 ? colors.greenAccent[500] : colors.blueAccent[500]} ${angle}deg 360deg),
            ${colors.greenAccent[500]}`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
        position: "relative",
      }}
    >
      {/* Affiche le pourcentage quand on survole le cercle */}
      {hovered && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: colors.primary[100],
            fontWeight: "bold",
          }}
        >
          {Math.round(progress * 100)}%
        </Box>
      )}
    </Box>
  );
};

export default ProgressCircle;


