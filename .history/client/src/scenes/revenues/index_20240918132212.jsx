import { Box, useTheme, IconButton, Modal, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import React, { useEffect, useState } from 'react';
import Header from "../../components/Header";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from "jspdf";
import 'jspdf-autotable';

const Revenues = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError } = useSelector((state) => state.auth);
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const [revenus, setRevenus] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate("/");
        }
    }, [isError, navigate]);

    useEffect(() => {
        getAllRevenus();
    }, []);

    const getAllRevenus = async () => {
        try {
            const response = await axios.get('http://localhost:5000/');
            setRevenus(response.data);
        } catch (error) {
            toast.error("Erreur lors de la récupération des revenus.", {
                autoClose: 10000
            });
        }
    };

   

    const columns = [
        {
            field: "revenuTotal",
            headerName: "Revenu Total",
            flex: 1,
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params) => (
                <Box>
                    <IconButton 
                        onClick={() => (params.row)} 
                        color="secondary"
                    >
                        <PrintIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const rows = revenus.map((revenu, index) => ({
        id: index + 1,
        revenuTotal: revenu.revenuTotal,
        date: revenu.date, // Ensure `date` field is included
    }));

    return (
        <Box m="20px">
            <Header title="REVENUS" subtitle="Liste des revenus" />
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.grey[100]} !important`,
                    },
                }}
            >
                <DataGrid 
                    rows={rows} 
                    columns={columns} 
                    pageSize={10} 
                    checkboxSelection 
                />
            </Box>
           
            <ToastContainer />
        </Box>
    );
};

export default Revenues;
