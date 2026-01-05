import { Box, useTheme, IconButton, Modal, Typography, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import React, { useEffect, useState } from 'react';
import Header from "../../components/Header";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrintIcon from "@mui/icons-material/Print";

import 'react-toastify/dist/ReactToastify.css';
import jsPDF from "jspdf";  // Importation de jsPDF
import 'jspdf-autotable';  // Pour la génération automatique de tables


const Revenus = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [revenus, setRevenus] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null); 

    useEffect(() => {
        getRevenus();
    }, []);

    const getRevenus = async () => {
        try {
            const response = await axios.get('http://localhost:5000/revenus');
            setRevenus(response.data);
        } catch (error) {
            toast.error("Erreur lors de la récupération des revenus.", {
                autoClose: 10000
            });
        }
    };

    const handleOpenModal = (rowData) => {
        setSelectedRowData(rowData); 
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedRowData(null); 
    };

    const handleGenerateInvoice = () => {
        if (selectedRowData) {
            const doc = new jsPDF();
            doc.text("DONNEES DES REVENUS", 20, 10);
            doc.text(`Date: ${selectedRowData.date}`, 20, 20);
            doc.text(`Revenus totaux: ${selectedRowData.revenuTotal} AR`, 20, 30);
            doc.save("revenus.pdf");
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
        },
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
                        onClick={() => handleOpenModal(params.row)}
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
        date: revenu.date,
        revenuTotal: revenu.revenuTotal,
    }));

    return (
        <Box m="20px">
            <Header title="LISTE DES REVENUS" subtitle="Liste de tous les revenus" />
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
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
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
                    components={{ Toolbar: GridToolbar }} 
                />
            </Box>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        IMPRIMER LES DONNEES DES REVENUS
                    </Typography>
                    {selectedRowData && (
                        <Box>
                            <Typography variant="body1">Date: {selectedRowData.date}</Typography>
                            <Typography variant="body1">Revenu Total: {selectedRowData.revenuTotal} AR</Typography>
                        </Box>
                    )}
                    <Button onClick={handleGenerateInvoice} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Imprimer
                    </Button>
                </Box>
            </Modal>
            <ToastContainer />
        </Box>
    );
};

export default Revenus;


