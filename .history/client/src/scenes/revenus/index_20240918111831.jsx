import { Box, useTheme, IconButton, Modal, Typography, Button, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import React, { useEffect, useState } from 'react';
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from "jspdf";  // Importation de jsPDF
import 'jspdf-autotable';  // Pour la génération automatique de tables


const Revenues = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const {isError} = useSelector((state => state.auth));

useEffect(() => {
    dispatch(getMe());
}, [ dispatch]);

useEffect(() => {
    if(isError){
        navigate("/");
    }
}, [isError, navigate]);

const theme = useTheme();
const colors = tokens(theme.palette.mode);
const [revenues, setRevenues] = useState([]);
const [openModal, setOpenModal] = useState(false);
const [selectedRowData, setSelectedRowData] = useState(null);
const [searchDate, setSearchDate] = useState('');

useEffect(() => {
    dispatch(getMe());
}, [dispatch]);

useEffect(() => {
    if (isError) {
        navigate("/");
    }
}, [isError, navigate]);

useEffect(() => {
    fetchRevenues();
}, [searchDate]);

const fetchRevenues = async () => {
    const url = searchDate ? `http://localhost:5000/revenus/${searchDate}` : 'http://localhost:5000/revenus';
    const response = await axios.get(url);
    setRevenues(response.data);
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
        doc.text("DONNEES DU REVENUS", 20, 10);
        doc.text(`Date: ${selectedRowData.date}`, 20, 20);
        doc.text(`Revenus Total: ${selectedRowData.revenuTotal}`, 20, 30);
        doc.save("facture.pdf");
    }
};

const handleSearch = (event) => {
    setSearchDate(event.target.value);
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
                    onClick={() => (params.row.uuid)} 
                    color="secondary"
                >
                    <DeleteIcon />
                </IconButton>
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

const rows = revenues.map((revenue, index) => ({
    id: index + 1,
    date: revenue.date,
    revenuTotal: revenue.revenuTotal,
}));

return (
    <Box m="20px">
        <Header title="REVENUS" subtitle="Liste des revenus" />
        <TextField
            label="Rechercher par date"
            variant="outlined"
            value={searchDate}
            onChange={handleSearch}
            sx={{ mb: 2 }}
        />
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
                components={{ Toolbar: GridToolbar }} 
            />
        </Box>
        {/* Modal pour générer la facture */}
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
                    IMPRIMER LES DONNEES DU REVENUS
                </Typography>

                {selectedRowData && (
                    <Box>
                        <Typography variant="body1">Date: {selectedRowData.date}</Typography>
                        <Typography variant="body1">Revenu Total: {selectedRowData.revenuTotal}</Typography>
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

export default Revenues;
