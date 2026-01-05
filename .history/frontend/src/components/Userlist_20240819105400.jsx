
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Userlist = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const response = await axios.get('http://localhost:5000/users');
    setUsers(response.data);
  };

  const deleteUser = async (userId) => {
    await axios.delete(`http://localhost:5000/users/${userId}`);
    getUsers();
  };

  const columns = [
    { field: 'id', headerName: 'No', renderCell: (index) => index.api.getRowIndex(index.row.id) + 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
        <Box>
          <Link to={`/users/edit/${params.row.id}`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton color="error" onClick={() => deleteUser(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

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
          backgroundColor: "#3f51b5", // Remplacez par `colors.blueAccent[700]` si vous utilisez un thème personnalisé
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: "#fafafa", // Remplacez par `colors.primary[400]` si vous utilisez un thème personnalisé
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: "#3f51b5", // Remplacez par `colors.blueAccent[700]` si vous utilisez un thème personnalisé
        },
        "& .MuiCheckbox-root": {
          color: "#66bb6a !important", // Remplacez par `colors.greenAccent[200]` si vous utilisez un thème personnalisé
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: "#ffffff !important", // Remplacez par `colors.grey[100]` si vous utilisez un thème personnalisé
        },
      }}
    >
      <DataGrid
        checkboxSelection
        rows={users}
        columns={columns}
        getRowId={(row) => row.id} // Assurez-vous que votre clé primaire correspond à l'attribut `id`
        components={{ Toolbar: GridToolbar }}
      />
    </Box>
  );
};

export default Userlist;
