import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { tokens } from '../theme';

const Productlist = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
    };

    const deleteProduct = async (productId) => {
        await axios.delete(`http://localhost:5000/products/${productId}`);
        getProducts();
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["No", "Product Name", "Price", "Created By"];
        const tableRows = [];

        products.forEach((product, index) => {
            const productData = [
                index + 1,
                product.name,
                product.price,
                product.user.name,
            ];
            tableRows.push(productData);
        });

        doc.autoTable(tableColumn, tableRows, { startY: 20 });
        doc.text("Product List", 14, 15);
        doc.save("product_list.pdf");
    };

    const columns = [
        { field: "id", headerName: "No", width: 90 },
        {
            field: "name",
            headerName: "Product Name",
            flex: 1,
        },
        {
            field: "price",
            headerName: "Price",
            flex: 1,
        },
        {
            field: "createdBy",
            headerName: "Created By",
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
                        to={`/products/edit/${params.row.uuid}`} 
                        color="primary"
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton 
                        onClick={() => deleteProduct(params.row.uuid)} 
                        color="secondary"
                    >
                        <DeleteIcon />
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
        createdBy: product.user.name,
    }));

    return (
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
            <Typography variant="h4" gutterBottom>
                <h1 className="title">Products</h1>
                <h2 className="subtitle">List of Products</h2>
                <Link to="/products/add" className="button is-primary mb-2">Add New</Link>
                <button onClick={exportPDF} className="button is-primary">Export PDF</button>
            </Typography>
            <DataGrid 
                rows={rows} 
                columns={columns} 
                pageSize={10} 
                checkboxSelection 
                components={{ Toolbar: GridToolbar }} 
            />
        </Box>
    );
};

export default Productlist;
