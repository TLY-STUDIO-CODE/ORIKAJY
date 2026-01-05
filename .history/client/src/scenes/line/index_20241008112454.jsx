import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Pour rediriger vers la page d'édition
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';

const Line = () => {
  const dispatch = useDispatch();
const navigate = useNavigate();
const { isError, user } = useSelector((state => state.auth));

useEffect(() => {
    dispatch(getMe());
}, [dispatch]);

useEffect(() => {
    if (isError) {
        navigate("/");
    }
    if (user && user.role !== "admin" && user.role !== "manager") {
        navigate("/dashboard");
    }
}, [isError, user, navigate]);
  const [selectedDate, setSelectedDate] = useState(""); // État pour la date sélectionnée

  // Gestionnaire de changement de date
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <Box m="20px">
      <Header title="GRAPHIQUE LINÉAIRE" subtitle="Suivi des rapports financiers avec un Graphique Linéaire" />
      {/* Champ de sélection de la date */}
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        style={{ marginBottom: '20px', padding: '8px', borderRadius: '4px' }}
      />
      
      <Box height="75vh">
        {/* Transmet la date au composant LineChart */}
        <LineChart date={selectedDate} />
      </Box>
    </Box>
  );
};

export default Line;

