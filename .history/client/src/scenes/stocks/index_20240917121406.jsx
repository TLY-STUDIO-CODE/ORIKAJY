import { Box, useTheme, IconButton, Modal, Typography, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import React, { useEffect, useState } from 'react';
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom"; // Pour rediriger vers la page d'édition
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';
import axios from "axios";
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from "jspdf";  // Importation de jsPDF
import 'jspdf-autotable';  // Pour la génération automatique de tables
import PrintIcon from "@mui/icons-material/Print";


const Stocks = () => {
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
const [stocks, setStocks] = useState([]);
const [openModal, setOpenModal] = useState(false);
const [selectedRowData, setSelectedRowData] = useState(null); // État pour stocker les données de la ligne sélectionnée

useEffect(() => {
    getStocks();
}, []);

const getStocks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/stocks');
            setStocks(response.data);
        } catch (error) {
            toast.error("Erreur lors de la récupération des stocks.", {
                autoClose: 10000
            });
        }
    };

    const handleOpenModal = (rowData) => {
        setSelectedRowData(rowData); // Mettre à jour l'état avec les données de la ligne sélectionnée
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedRowData(null); // Réinitialiser les données de la ligne sélectionnée après la fermeture
    };

    const handleGenerateInvoice = () => {
        if (selectedRowData) {
            const doc = new jsPDF();
            // Titre de la facture
            doc.text(`DONNEES DE STOCKAGE CREE PAR:${selectedRowData.createdBy}`, 20, 10)``
            doc.text(`Produits: ${selectedRowData.name}`, 20, 20);
            doc.text(`Descriptions de stock: ${selectedRowData.description}`, 20, 30);
            doc.text(`Quantité de produit : ${selectedRowData.qte}`, 20, 40);
            doc.text(`Catégorie de produit: ${selectedRowData.categories}`, 20, 50);
            doc.text(`Prix unitaire de produit: ${selectedRowData.montantS} AR`, 20, 60);
            doc.text(`Date de stock: ${selectedRowData.date_stock}`, 20, 70);
            doc.text(`Numéro de facturation: ${selectedRowData.num_fact}`, 20, 80);
            doc.text(`Total Montant: ${selectedRowData.montant_totalS} AR`, 20, 90);

            // Générer et télécharger le fichier PDF
            doc.save("facture.pdf");
        }
    };


    const deleteStock = async (stockId) => {
        try {
            await axios.delete(`http://localhost:5000/stocks/${stockId}`);
            getStocks();
            toast.success("Stock supprimé avec succès!", {
                autoClose: 10000, // 30 seconds
            });
        } catch (error) {
            toast.error("Erreur lors de la suppression du stock.", {
                autoClose: 10000
            });
        }
    };
    const generateInvoice = (stock) => {
        navigate(`/invoice/${stock.uuid}`);
    };


const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
        field: "name",
        headerName: "Nom du produit"
    },
    {
        field: "qte",
        headerName: "Quantité du produit",
        flex: 1,
    },
    {
        field: "unit",
        headerName: "Unité",
        flex: 1,
    },
    {
        field: "montantS",
        headerName: "Prix unitaire",
        flex: 1,
    },
    {
        field: "montant_totalS",
        headerName: "Prix total",
        flex: 1,
    },
    {
        field: "categories",
        headerName: "Catégorie du produit",
        flex: 1,
    },
    {
        field: "date_stock",
        headerName: "Date de mise en stock",
        flex: 1,
    },
    {
        field: "num_fact",
        headerName: "Numéro de facturation",
        flex: 1,
    },
    {
        field: "createdBy",
        headerName: "Créé par",
        flex: 1,
    },
    {
        field: "actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params) => (
            <Box>
                <IconButton 
                    component={Link} 
                    to={`/stocks/edit/${params.row.uuid}`} 
                    color="primary"
                >
                    <EditIcon />
                </IconButton>
                <IconButton 
                    onClick={() => deleteStock(params.row.uuid)} 
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
const rows = stocks.map((stock, index) => ({
    id: index + 1,
    uuid: stock.uuid,
    name: stock.name,
    qte: stock.qte,
    unit: stock.unit,
    montantS: stock.montantS,
    montant_totalS: stock.montant_totalS,
    categories: stock.categories,
    date_stock: stock.date_stock,
    num_fact: stock.num_fact,
    createdBy: stock.user.name,
}));

return (
<Box m="20px">
<Header title="LISTE DES STOCKS" subtitle="Liste de tous les stocks de produit" />
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
                        IMPRIMER LES DONNEES DE STOCKAGE
                    </Typography>

                    {/* Afficher les données de la ligne sélectionnée */}
                    {selectedRowData && (
                        <Box>
                            <Typography variant="body1">Créé par: {selectedRowData.createdBy}</Typography>
                            <Typography variant="body1">Produit: {selectedRowData.name}</Typography>
                            <Typography variant="body1">Prix: {selectedRowData.montantS} AR</Typography>
                            <Typography variant="body1">Total prix: {selectedRowData.montant_totalS} AR</Typography>
                            <Typography variant="body1">Date: {selectedRowData.date_stock}</Typography>
                            <Typography variant="body1">Numéro de facturation: {selectedRowData.num_fact}</Typography>
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

export default Stocks;
