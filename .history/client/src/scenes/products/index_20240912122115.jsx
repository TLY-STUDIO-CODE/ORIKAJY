import { Box, useTheme, IconButton } from "@mui/material";
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

const Products = () => {
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

const columns = [
      { field: "id", headerName: "ID", width: 90 },
      {
          field: "name",
          headerName: "Nom de produit",
          flex: 1,
      },
      {
          field: "price",
          headerName: "Prix unitaire",
          flex: 1,
      },
      {
          field: "num_factP",
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
      num_factP: product.num_factP,
      createdBy: product.user.name,
  }));

  return (
  <Box m="20px">
    <Header title="PRODUITS" subtitle="Liste des produits" />
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

export default Products;
