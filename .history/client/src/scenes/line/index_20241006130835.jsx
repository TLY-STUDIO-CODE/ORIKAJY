import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import React, { useState } from "react";

const Line = () => {
    const [selectedDate, setSelectedDate] = useState("");

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    return (
        <Box m="20px">
            <Header title="GRAPHIQUE LINEAIRE" subtitle="Suivi des Tendances avec un Graphique Linéaire" />
            <Box height="75vh">
                <input type="date" onChange={handleDateChange} />
                <LineChart selectedDate={selectedDate} />
            </Box>
        </Box>
    );
};

export default Line;
