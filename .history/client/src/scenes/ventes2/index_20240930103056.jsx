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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Ventes2 = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { isError, user } = useSelector((state) => state.auth);

useEffect(() => {
    dispatch(getMe());
}, [dispatch]);

useEffect(() => {
    if (isError) {
        navigate("/");
    }
    if (user && user.role !== "admin" && user.role !== "user") {
        navigate("/dashboard");
    }
}, [isError, user, navigate]);

const theme = useTheme();
const colors = tokens(theme.palette.mode);
const [ventes2, setVentes2] = useState([]);
const [openModal, setOpenModal] = useState(false);
const [selectedRowData, setSelectedRowData] = useState(null); // État pour stocker les données de la ligne sélectionnée
const [openDeleteModal, setOpenDeleteModal] = useState(false);
const [selectedVente2, setSelectedVente2] = useState(null);


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
                    units: [],
                    montants: [],
                    montant_total: 0,
                    totalVente2: 0,
                    date_vente: vente.date_vente,
                    num_factV: vente.num_factV,
                    createdBy: vente.user.name,
                    validated: vente.validated,
                };
            }

            acc[name_client].names.push(vente.name);
            acc[name_client].descriptions.push(vente.description);
            acc[name_client].categories.push(vente.categories);
            acc[name_client].qtes.push(vente.qte);
            acc[name_client].units.push(vente.unit);
            acc[name_client].montants.push(vente.montant);
            

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
const handleOpenDeleteModal = (vente2) => {
setSelectedVente2(vente2);
setOpenDeleteModal(true);
};
const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedVente2(null);
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
            doc.text("FACTURE DE VENTE", 20, 10);
            doc.text(`Créé par: ${selectedRowData.createdBy}`, 20, 20);
            doc.text(`Client: ${selectedRowData.name_client}`, 20, 30);
            doc.text(`Produit: ${selectedRowData.names.join(", ")}`, 20, 40);
            doc.text(`Déscription: ${selectedRowData.descriptions.join(", ")}`, 20, 50);
            doc.text(`Quantité  ${selectedRowData.qtes.join(", ")}`, 20, 60);
            doc.text(`Unité: ${selectedRowData.units.join(", ")}`, 20, 70);
            doc.text(`Catégorie: ${selectedRowData.categories.join(", ")}`, 20, 80);
            doc.text(`Prix unitaire: ${selectedRowData.montants.join(", ")}`, 20, 90);
            doc.text(`Date de vente: ${selectedRowData.date_vente}`, 20, 100);
            doc.text(`Numéro de facturation: ${selectedRowData.num_factV}`, 20, 110);
            doc.text(`Prix total: ${selectedRowData.montant_total} AR`, 20, 120);
            doc.text(`Status: ${selectedRowData.validated}`, 20, 130);
            // Générer et télécharger le fichier PDF
            doc.save("facture.pdf");
        }
    };
    const validateVente2 = async (venteId) => {
    try {
        await axios.patch(`http://localhost:5000/ventes2/validate/${venteId}`);
        getVentes2();
        toast.success(" Vente validé avec succès!", {
            autoClose: 10000, // 30 seconds
        });
    } catch (error) {
        toast.error("Erreur lors de la validation du vente.", {
            autoClose: 10000
        });
    }
};

    const deleteVente2 = async (venteId) => {
        try {
            await axios.delete(`http://localhost:5000/ventes2/${venteId}`);
            getVentes2();
            toast.success("Vente supprimé avec succès!", {
                autoClose: 10000, // 30 seconds
            });
         setOpenDeleteModal(false); // Fermer le modal après suppression
        } catch (error) {
            toast.error("Erreur lors de la suppression du vente.", {
                autoClose: 10000
            });
        }
    };

    const printInvoice = (vente) => {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Imprimer facture de vente</title>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(`<h1>Facture de ${vente.name_client}</h1>`);
        printWindow.document.write(`<p>Créé par: ${vente.createdBy}</p>`);
        printWindow.document.write(`<p>Produit: ${vente.names.join(", ")}</p>`);
        printWindow.document.write(`<p>Déscription: ${vente.descriptions.join(", ")}</p>`);
        printWindow.document.write(`<p>Quantité: ${vente.qtes.join(", ")}</p>`);
        printWindow.document.write(`<p>Unité: ${vente.units.join(", ")}</p>`);
        printWindow.document.write(`<p>Catégorie: ${vente.categories.join(", ")}</p>`);
        printWindow.document.write(`<p>Prix unitaire: ${vente.montants.join(", ")}</p>`);
        printWindow.document.write(`<p>Date de vente: ${vente.date_vente}</p>`);
        printWindow.document.write(`<p>Numéro de facturation: ${vente.num_factV}</p>`);
        printWindow.document.write(`<p>Prix total: ${vente.montant_total} AR</p>`);
        printWindow.document.write(`<p>Status: ${vente.validated}</p>`);
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
            headerName: "Produit",
            flex: 1,
            valueGetter: (params) => params.row.names.join(", "),
        },
        {
            field: "categories",
            headerName: "Catégorie",
            flex: 1,
            valueGetter: (params) => params.row.categories.join(", "),
        },
        {
            field: "name_client",
            headerName: "Client",
            flex: 1,
        },
        {
            field: "descriptions",
            headerName: "Déscription",
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
            field: "units",
            headerName: "Unité",
            flex: 1,
            valueGetter: (params) => params.row.units.join(", "),
        },
        {
            field: "montants",
            headerName: "Prix unitaire",
            flex: 1,
            valueGetter: (params) => params.row.montants.join(", "),
        },
        {
            field: "montant_total",
            headerName: "Prix total",
            flex: 1,
        },
        {
            field: "totalVente2",
            headerName: "Prix total",
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
            field: "validated",
            headerName: "Status",
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
                <IconButton onClick={() => handleOpenDeleteModal(params.row)} color="secondary">
                        <DeleteIcon />
                </IconButton>
                    <IconButton 
                    onClick={() => validateVente2(params.row.uuid)} 
                    color="secondary"
                >
                    <CheckCircleIcon />
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
        validated: vente2.validated
    }));

    return (
        <Box m="20px">
            <Header title="VENTES" subtitle="Liste de tous les ventes de produit" />
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
                        Êtes-vous sûr de vouloir supprimer cette vente ?
                    </Typography>
                    <Box mt={2}>
                        <Button onClick={() => {
                            deleteVente2(selectedVente2.uuid);
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
                        GENERER LA FACTURE
                    </Typography>

                    {/* Afficher les données de la ligne sélectionnée */}
                    {selectedRowData && (
                        <Box>
                            <Typography variant="body1">Créé par: {selectedRowData.createdBy}</Typography>
                            <Typography variant="body1">Client: {selectedRowData.name_client}</Typography>
                            <Typography variant="body1">Produit: {selectedRowData.names.join(", ")}</Typography>
                            <Typography variant="body1">Quantité: {selectedRowData.qtes.join(", ")}</Typography>
                            <Typography variant="body1">Unité: {selectedRowData.units.join(", ")}</Typography>
                            <Typography variant="body1">Prix unitaire: {selectedRowData.montants.join(", ")} AR</Typography>
                            <Typography variant="body1">Total prix: {selectedRowData.montant_total} AR</Typography>
                            <Typography variant="body1">Date de vente: {selectedRowData.date_vente}</Typography>
                            <Typography variant="body1">Status: {selectedRowData.validated}</Typography>
                        </Box>
                    )}

                    <Button onClick={handleGenerateInvoice} variant="contained" color="secondary" sx={{ mr: 2 }}>
                        Générer
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

export default Ventes2;


