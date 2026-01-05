import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart2 from "../../components/LineChart2";
import { useNavigate } from "react-router-dom"; // Pour rediriger vers la page d'édition
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';
import React, { useEffect, useState } from 'react';
const Line2 = () => {
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
  return (
    <Box m="20px">
        <Header title="GRAPHIQUE LINÉAIRE" subtitle="Suivi des rapports de ventes, achats et commandes avec un Graphique Linéaire" />
      <Box height="75vh">
        <LineChart2 />
      </Box>
    </Box>
  );
};

export default Line2;
