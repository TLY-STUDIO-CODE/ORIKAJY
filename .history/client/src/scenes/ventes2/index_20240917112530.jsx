import { Box, useTheme, IconButton, Modal, Typography, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import React, { useEffect, useState } from 'react';
import Header from "../../components/Header";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';
import axios from "axios";
import jsPDF from "jspdf";  // Importation de jsPDF
import 'jspdf-autotable';  // Pour la génération automatique de tables

const Ventes2 = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate("/");
        }
    }, [isError, navigate]);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [ventes2, setVentes2] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null); // État pour stocker les données de la ligne sélectionnée

    useEffect(() => {
        getVentes2();
    }, []);

    const groupVentesByClient = (ventes) => {
        const grouped = ventes.reduce((acc, vente) => {
            const { name_client } = vente;

            if (!acc[name_client]) {
                acc[name_client] = {
                    uuid: vente.uuid,
                    name_client,
                    names: [],
                    descriptions: [],
                    categories: [],
                    qtes: [],
                    montants: [],
                    montant_total: 0,
                    date_vente: vente.date_vente,
                    num_factV: vente.num_factV,
                    createdBy: vente.user.name,
                };
            }

            acc[name_client].names.push(vente.name);
            acc[name_client].descriptions.push(vente.description);
            acc[name_client].categories.push(vente.categories);
            acc[name_client].qtes.push(vente.qte);
            acc[name_client].montants.push(vente.montant);
            acc[name_client].montant_total += vente.montant * vente.qte;

            return acc;
        }, {});

        return Object.values(grouped);
    };

    const getVentes2 = async () => {
        try {
            const response = await axios.get('http://localhost:5000/ventes2');
            const groupedVentes = groupVentesByClient(response.data);
            setVentes2(groupedVentes);
        } catch (error) {
            console.error("Erreur lors de la récupération des ventes", error);
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
            doc.text("Facture", 20, 10);
            doc.text(`Client: ${selectedRowData.name_client}`, 20, 20);
            doc.text(`Produits: ${selectedRowData.names.join(", ")}`, 20, 30);
            doc.text(`Descriptions de vente: ${selectedRowData.descriptions.join(", ")}`, 20, 40);
            doc.text(`Quantité de produit : ${selectedRowData.qtes.join(", ")}`, 20, 50);
            doc.text(`Catégorie de produit: ${selectedRowData.categories.join(", ")}`, 20, 60);
            doc.text(`Prix unitaire de produit: ${selectedRowData.montants.join(", ")}`, 20, 70);
            doc.text(`Date de vente: ${selectedRowData.date_vente}`, 20, 80);
            doc.text(`Numéro de facturation: ${selectedRowData.num_factV}`, 20, 90);
            doc.text(`Total Montant: ${selectedRowData.montant_total} AR`, 20, 100);

            // Générer et télécharger le fichier PDF
            doc.save("facture.pdf");
        }
    };

    const deleteVente2 = async (venteId) => {
        try {
            await axios.delete(`http://localhost:5000/ventes2/${venteId}`);
            getVentes2();
        } catch (error) {
            console.error("Erreur lors de la suppression de la vente", error);
        }
    };

    const printInvoice = (vente) => {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Imprimer facture</title>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(`<h1>Facture de ${vente.name_client}</h1>`);
        printWindow.document.write(`<p>Produits: ${vente.names.join(", ")}</p>`);
        printWindow.document.write(`<p>Descriptions de vente: ${vente.descriptions.join(", ")}</p>`);
        printWindow.document.write(`<p>Quantité de produit : ${vente.qtes.join(", ")}</p>`);
        printWindow.document.write(`<p>Catégorie de produit: ${vente.categories.join(", ")}</p>`);
        printWindow.document.write(`<p>Prix unitaire de produit: ${vente.montants.join(", ")}</p>`);
        printWindow.document.write(`<p>Date de vente: ${vente.date_vente}</p>`);
        printWindow.document.write(`<p>Numéro de facturation: ${vente.num_factV}</p>`);
        printWindow.document.write(`<p>Total Montant: ${vente.montant_total} AR</p>`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    const generateInvoice = (vente) => {
        navigate(`/invoice/${vente.uuid}`);
    };

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "names",
            headerName: "Produits",
            flex: 1,
            valueGetter: (params) => params.row.names.join(", "),
        },
        {
            field: "name_client",
            headerName: "Nom du client",
            flex: 1,
        },
        {
            field: "descriptions",
            headerName: "Descriptions",
            flex: 1,
            valueGetter: (params) => params.row.descriptions.join(", "),
        },
        {
            field: "qtes",
            headerName: "Quantités",
            flex: 1,
            valueGetter: (params) => params.row.qtes.join(", "),
        },
        {
            field: "categories",
            headerName: "Catégories",
            flex: 1,
            valueGetter: (params) => params.row.categories.join(", "),
        },
        {
            field: "montants",
            headerName: "Montants unitaires",
            flex: 1,
            valueGetter: (params) => params.row.montants.join(", "),
        },
        {
            field: "montant_total",
            headerName: "Montant total",
            flex: 1,
        },
        {
            field: "date_vente",
            headerName: "Date de vente",
            flex: 1,
        },
        {
            field: "num_factV",
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
            width: 200,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        onClick={() => deleteVente2(params.row.uuid)}
                        color="secondary"
                    >
                        <DeleteIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => printInvoice(params.row)}
                        color="secondary"
                    >
                        <PrintIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => handleOpenModal(params.row)}  // Passer les données de la ligne au modal
                        color="secondary"
                    >
                        <ReceiptIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const rows = ventes2.map((vente2, index) => ({
        id: index + 1,
        uuid: vente2.uuid,
        ...vente2,
    }));

    return (
        <Box m="20px">
            <Header title="LISTE DES VENTES" subtitle="Liste de tous les ventes de produit" />
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
                    checkboxSelection
                    rows={rows}
                    columns={columns}
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
                        Générer la Facture
                    </Typography>

                    {/* Afficher les données de la ligne sélectionnée */}
                    {selectedRowData && (
                        <Box>
                            <Typography variant="body1">Client: {selectedRowData.name_client}</Typography>
                            <Typography variant="body1">Produits: {selectedRowData.names.join(", ")}</Typography>
                            <Typography variant="body1">Total: {selectedRowData.montant_total} AR</Typography>
                            <Typography variant="body1">Date: {selectedRowData.date_vente}</Typography>
                        </Box>
                    )}

                    <Button onClick={handleGenerateInvoice} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Générer la Facture
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default Ventes2;


