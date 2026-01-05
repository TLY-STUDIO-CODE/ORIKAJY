import { Box, useTheme, IconButton } from "@mui/material";
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

    useEffect(() => {
        getVentes2();
    }, []);

    const groupVentesByClient = (ventes) => {
        const grouped = ventes.reduce((acc, vente) => {
            const { name_client } = vente;

            if (!acc[name_client]) {
                acc[name_client] = {
                    uuid: vente.uuid,  // Assume uuid is unique
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

    const deleteVente2 = async (venteId) => {
        try {
            await axios.delete(`http://localhost:5000/ventes2/${venteId}`);
            getVentes2();  // Rafraîchir la liste des ventes après la suppression
        } catch (error) {
            console.error("Erreur lors de la suppression de la vente", error);
        }
    };

    const printInvoice = (vente) => {
        // Implement the print functionality here
        console.log("Printing invoice for:", vente);
        // Example: Create a printable area and call window.print()
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print Invoice</title>');
        printWindow.document.write('</head><body >');
        printWindow.document.write(`<h1>Invoice for ${vente.name_client}</h1>`);
        printWindow.document.write(`<p>Products: ${vente.names.join(", ")}</p>`);
        printWindow.document.write(`<p>Total Amount: ${vente.montant_total}</p>`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    const generateInvoice = (vente) => {
        // Implement the invoice generation functionality here
        console.log("Generating invoice for:", vente);
        // Example: Redirect to an invoice page or generate a PDF
        // Redirect example:
        navigate(`/invoice/${vente.uuid}`);
        // PDF generation could involve using a library like jsPDF
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
                        color="primary"
                    >
                        <PrintIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => generateInvoice(params.row)}
                        color="primary"
                    >
                        <ReceiptIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const rows = ventes2.map((vente2, index) => ({
        id: index + 1,
        uuid: vente2.uuid, // Use uuid as unique id
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
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    checkboxSelection
                    components={{ Toolbar: GridToolbar }}
                />
            </Box>
        </Box>
    );
};

export default Ventes2;

