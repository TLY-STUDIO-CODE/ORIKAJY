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


const Commandes = () => {
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
    const [commandes, setCommandes] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null); // État pour stocker les données de la ligne sélectionnée

    useEffect(() => {
        getCommandes();
    }, []);

    const groupCommandesByClient = (commandes) => {
        const grouped = commandes.reduce((acc, commande) => {
            const { name_client } = commande;

            if (!acc[name_client]) {
                acc[name_client] = {
                    uuid: commande.uuid,
                    name_client,
                    names: [],
                    descriptions: [],
                    categories: [],
                    qtes: [],
                    units: [],
                    montants: [],
                    montant_totalC: 0,
                    date_commande: commande.date_commande,
                    num_factC: commande.num_factC,
                    createdBy: commande.user.name,
                };
            }

            acc[name_client].names.push(commande.name);
            acc[name_client].descriptions.push(commande.description);
            acc[name_client].categories.push(commande.categories);
            acc[name_client].qtes.push(commande.qte);
            acc[name_client].units.push(commande.unit);
            acc[name_client].montants.push(commande.montantC);
            acc[name_client].montant_totalC += commande.montantC * commande.qte;

            return acc;
        }, {});

        return Object.values(grouped);
    };

    const getCommandes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/commandes');
            const groupedCommandes = groupCommandesByClient(response.data);
            setCommandes(groupedCommandes);
        } catch (error) {
            console.error("Erreur lors de la récupération des commandes", error);
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
            doc.text("FACTURE DE COMMANDE", 20, 10);
            doc.text(`Créé par: ${selectedRowData.createdBy}`, 20, 20);
            doc.text(`Client: ${selectedRowData.name_client}`, 20, 30);
            doc.text(`Produits: ${selectedRowData.names.join(", ")}`, 20, 40);
            doc.text(`Descriptions de commande: ${selectedRowData.descriptions.join(", ")}`, 20, 50);
            doc.text(`Quantité de produit: ${selectedRowData.qtes.join(", ")}`, 20, 60);
            doc.text(`Unité: ${selectedRowData.units.join(", ")}`, 20, 70);
            doc.text(`Catégorie de produit: ${selectedRowData.categories.join(", ")}`, 20, 80);
            doc.text(`Prix unitaire de produit: ${selectedRowData.montants.join(", ")} AR`, 20, 90);
            doc.text(`Date de commande: ${selectedRowData.date_commande}`, 20, 100);
            doc.text(`Numéro de facturation: ${selectedRowData.num_factC}`, 20, 110);
            doc.text(`Total Montant: ${selectedRowData.montant_totalC} AR`, 20, 120);
            doc.text(`Status: ${selectedRowData.validated}`, 20, 130);

            // Générer et télécharger le fichier PDF
            doc.save("facture.pdf");
        }
    };

    const deleteCommande = async (commandeId) => {
        try {
            await axios.delete(`http://localhost:5000/commandes/${commandeId}`);
            getCommandes();
            toast.success("Commande supprimé avec succès!", {
                autoClose: 10000, // 30 seconds
            });
        } catch (error) {
            toast.error("Erreur lors de la suppression du commande.", {
                autoClose: 10000
            });
        }
    };
    const validateCommande = async (commandeId) => {
    try {
        await axios.patch(`http://localhost:5000/commandes/validate/${commandeId}`);
        getCommandes();
        toast.success("Commande validé avec succès!", {
            autoClose: 10000, // 30 seconds
        });
    } catch (error) {
        toast.error("Erreur lors de la validation du commande.", {
            autoClose: 10000
        });
    }
};


    const printInvoice = (commande) => {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Imprimer facture de la commande</title>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(`<h1>Facture de ${commande.name_client}</h1>`);
        printWindow.document.write(`<p>Créé par: ${commande.createdBy}</p>`);
        printWindow.document.write(`<p>Produit: ${commande.names.join(", ")}</p>`);
        printWindow.document.write(`<p>Déscription du commande: ${commande.descriptions.join(", ")}</p>`);
        printWindow.document.write(`<p>Quantité de produit : ${commande.qtes.join(", ")}</p>`);
        printWindow.document.write(`<p>Unité : ${commande.units.join(", ")}</p>`);
        printWindow.document.write(`<p>Catégorie de produit: ${commande.categories.join(", ")}</p>`);
        printWindow.document.write(`<p>Prix unitaire de produit: ${commande.montants.join(", ")} AR</p>`);
        printWindow.document.write(`<p>Date de commande: ${commande.date_commande}</p>`);
        printWindow.document.write(`<p>Numéro de facturation: ${commande.num_factC}</p>`);
        printWindow.document.write(`<p>Total Prix: ${commande.montant_totalC} AR</p>`);
        printWindow.document.write(`<p>Status: ${commande.validated}</p>`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    const generateInvoice = (commande) => {
        navigate(`/invoice/${commande.uuid}`);
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
            headerName: "Catégories",
            flex: 1,
            valueGetter: (params) => params.row.categories.join(", "),
        },
        {
            field: "name_client",
            headerName: "Nom du client",
            flex: 1,
        },
        {
            field: "descriptions",
            headerName: "Déscription du commande",
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
            field: "montant_totalC",
            headerName: "Prix total",
            flex: 1,
        },
        {
            field: "date_commande",
            headerName: "Date de commande",
            flex: 1,
        },
        {
            field: "num_factC",
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
                    <IconButton
                        onClick={() => deleteCommande(params.row.uuid)}
                        color="secondary"
                    >
                        <DeleteIcon />
                    </IconButton>
                    <IconButton 
                    onClick={() => validateCommande(params.row.uuid)} 
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

    const rows = commandes.map((commande, index) => ({
        id: index + 1,
        uuid: commande.uuid,
        ...commande,
        validated: commande.validated,
    }));

    return (
        <Box m="20px">
            <Header title="COMMANDES" subtitle="Liste de tous les commandes de produit" />
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
                            <Typography variant="body1">Prix: {selectedRowData.montants.join(", ")} AR</Typography>
                            <Typography variant="body1">Total prix: {selectedRowData.montant_totalC} AR</Typography>
                            <Typography variant="body1">Date: {selectedRowData.date_commande}</Typography>
                            <Typography variant="body1">Status: {selectedRowData.validated}</Typography>
                        </Box>
                    )}

                    <Button onClick={handleGenerateInvoice} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Générer
                    </Button>
                </Box>
            </Modal>
            <ToastContainer />
        </Box>
    );
};

export default Commandes;


