import { Box, useTheme, IconButton, Modal, Typography, Button, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import React, { useEffect, useState } from 'react';
import Header from "../../components/Header";
import PrintIcon from "@mui/icons-material/Print";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from "jspdf";

const Revenues = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError } = useSelector((state) => state.auth);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [revenus, setRevenus] = useState([]);
    const [filteredRevenus, setFilteredRevenus] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [searchType, setSearchType] = useState('');
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        dispatch(getMe());
        getAllRevenus(); // Fetch all revenues when component mounts
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate("/");
        }
    }, [isError, navigate]);

    useEffect(() => {
        if (searchType && searchValue) {
            fetchFilteredData();
        } else {
            setFilteredRevenus(revenus); // Reset to all revenues if no search filters
        }
    }, [searchType, searchValue, revenus]);

    const getAllRevenus = async () => {
        try {
            const response = await axios.get('http://localhost:5000/revenus');
            setRevenus(response.data);
            setFilteredRevenus(response.data);
        } catch (error) {
            toast.error("Erreur lors de la récupération des revenus.", {
                autoClose: 10000
            });
        }
    };

    const fetchFilteredData = async () => {
        try {
            let response;
            const formattedSearchValue = encodeURIComponent(searchValue); // Encode the search value
            if (searchType === 'revenuTotal') {
                response = await axios.get(`http://localhost:5000/revenus/total`);
            } else if (searchType === 'date') {
                response = await axios.get(`http://localhost:5000/revenus/${formattedSearchValue}`);
            } else if (searchType === 'ventesByDate') {
                response = await axios.get(`http://localhost:5000/ventes/${formattedSearchValue}`);
            }
            setFilteredRevenus(response.data);
        } catch (error) {
            toast.error("Erreur lors de la récupération des données filtrées.", {
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
            doc.text("DONNEES DU REVENUS", 20, 10);
            doc.text(`Date: ${selectedRowData.date}`, 20, 20);
            doc.text(`Revenus Total: ${selectedRowData.revenuTotal}`, 20, 30);
            doc.save("revenu.pdf");
        }
    };

    // Note: columns and rows are removed from DataGrid since it's not being used anymore.

    return (
        <Box m="20px">
            <Header title="REVENUS" subtitle="Liste des revenus" />
            <Box m="20px 0">
                <FormControl fullWidth>
                    <InputLabel>Type de recherche</InputLabel>
                    <Select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        label="Type de recherche"
                    >
                        <MenuItem value="revenuTotal">Revenu Total</MenuItem>
                        <MenuItem value="date">Date</MenuItem>
                        <MenuItem value="ventesByDate">Ventes par Date</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box m="20px 0">
                <TextField
                    fullWidth
                    label="Valeur de recherche"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </Box>
            <Box m="20px 0">
                {/* Instead of DataGrid, display the data directly */}
                {filteredRevenus && filteredRevenus.map((item) => (
                    <Box key={item.id} mb="10px" p="10px" border="1px solid grey">
                        <Typography>Date: {item.date}</Typography>
                        <Typography>Revenu Total: {item.revenuTotal}</Typography>
                        <Button variant="contained" color="primary" onClick={() => handleOpenModal(item)}>
                            Voir Détails
                        </Button>
                    </Box>
                ))}
            </Box>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        maxWidth: "80%",
                        maxHeight: "80%",
                        overflowY: "auto",
                    }}
                >
                    <Typography variant="h6" component="h2" gutterBottom>
                        Détails des revenus
                    </Typography>
                    {selectedRowData && (
                        <Box>
                            <Typography>Date: {selectedRowData.date}</Typography>
                            <Typography>Revenus Total: {selectedRowData.revenuTotal}</Typography>
                            <Button variant="contained" color="primary" onClick={handleGenerateInvoice}>
                                Télécharger le PDF
                            </Button>
                        </Box>
                    )}
                </Box>
            </Modal>
            <ToastContainer />
        </Box>
    );
};

export default Revenues;



