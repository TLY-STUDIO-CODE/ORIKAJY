import { Box, useTheme, IconButton, Modal, Typography, Button  } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import React, { useEffect, useState } from 'react';
import Header from "../../components/Header";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom"; // Pour rediriger vers la page d'édition
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';
import axios from "axios";
import jsPDF from "jspdf";  // Importation de jsPDF
import 'jspdf-autotable';  // Pour la génération automatique de tables
import PrintIcon from "@mui/icons-material/Print";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Products = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { isError, user } = useSelector((state => state.auth));

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
const [products, setProducts] = useState([]);
const [openModal, setOpenModal] = useState(false);
const [openDeleteModal, setOpenDeleteModal] = useState(false);
const [selectedRowData, setSelectedRowData] = useState(null); // État pour stocker les données de la ligne sélectionnée
const [selectedProduct, setSelectedProduct] = useState(null);

useEffect(() => {
    getProducts();
}, []);

const getProducts = async () => {
    const response = await axios.get('http://localhost:5000/products');
    setProducts(response.data);
};
const handleOpenModal = (rowData) => {
setSelectedRowData(rowData); // Mettre à jour l'état avec les données de la ligne sélectionnée
setOpenModal(true);
};
const handleOpenDeleteModal = (product) => {
    setSelectedProduct(product);
    setOpenDeleteModal(true);
};

const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedProduct(null);
};

const handleCloseModal = () => {
setOpenModal(false);
setSelectedRowData(null); // Réinitialiser les données de la ligne sélectionnée après la fermeture
};

const handleGenerateInvoice = () => {
    if (selectedRowData) {
        const doc = new jsPDF();
        // Titre de la facture
        doc.text("DONNEES DU PRODUIT ", 20, 10);
        doc.text(`Créé par: ${selectedRowData.createdBy}`, 20, 20);
        doc.text(`Produit: ${selectedRowData.name}`, 20, 30);
        doc.text(`Prix unitaire: ${selectedRowData.price} AR`, 20, 40);

        // Générer et télécharger le fichier PDF
        doc.save("facture.pdf");
    }
};

const deleteProduct = async (productId) => {
    try {
        await axios.delete(`http://localhost:5000/products/${productId}`);
        getProducts();
        toast.success("Produit supprimé avec succès!", {
            autoClose: 10000, // 30 seconds
        });
        setOpenDeleteModal(false); // Fermer le modal après suppression
    } catch (error) {
        toast.error("Erreur lors de la suppression du produit.", {
            autoClose: 10000
        });
    }
};

const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
        field: "name",
        headerName: "Produit",
        flex: 1,
    },
    {
        field: "price",
        headerName: "Prix unitaire",
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
                {user && user.role !== "manager" && (
                <IconButton onClick={() => handleOpenDeleteModal(params.row)} color="secondary">
                        <DeleteIcon />
                </IconButton>
                )}
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
const rows = products.map((product, index) => ({
    id: index + 1,
    uuid: product.uuid,
    name: product.name,
    price: product.price,
    num_factP: product.num_factP,
    createdBy: product.user.name,
}));

return (
<Box m="20px">
<Header title="PRODUITS" subtitle="Liste de tous les produits en stock" />
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
{/* Modal de confirmation de suppression */}
            <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
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
                    <Typography variant="h6" component="h2">
                        Confirmer la suppression
                    </Typography>
                    <Typography variant="body1">
                        Êtes-vous sûr de vouloir supprimer ce produit ?
                    </Typography>
                    <Box mt={2}>
                        <Button onClick={() => {
                            deleteProduct(selectedProduct.uuid);
                        }} variant="contained" color="secondary" sx={{ mr: 2 }}>
                            Supprimer
                        </Button>
                        <Button onClick={handleCloseDeleteModal} variant="outlined" color="secondary">
                            Annuler
                        </Button>
                    </Box>
                </Box>
            </Modal>
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
                    IMPRIMER LES DONNEES DU PRODUIT
                </Typography>

                {/* Afficher les données de la ligne sélectionnée */}
                {selectedRowData && (
                    <Box>
                        <Typography variant="body1">Créé par: {selectedRowData.createdBy}</Typography>
                        <Typography variant="body1">Produit: {selectedRowData.name}</Typography>
                        <Typography variant="body1">Prix unitaire: {selectedRowData.price} AR</Typography>
                    </Box>
                )}
                <Button onClick={handleGenerateInvoice} variant="contained" color="secondary" sx={{ mr: 2 }}>
                        Imprimer
                    </Button>
                    <Button onClick={handleCloseModal} variant="outlined" color="secondary">
                        Annuler
                    </Button>
            </Box>
        </Modal>
<ToastContainer />
</Box>
);
};

export default Products;
