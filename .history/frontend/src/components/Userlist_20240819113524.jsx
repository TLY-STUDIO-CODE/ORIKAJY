import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Typography, IconButton, useTheme } from "@mui/material";

const Userlist = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
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
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "role",
            headerName: "Role",
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
                        to={`/users/edit/${params.row.uuid}`} 
                        color="primary"
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton 
                        onClick={() => deleteUser(params.row.uuid)} 
                        color="secondary"
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const rows = users.map((user, index) => ({
        id: index + 1,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
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
            <Typography variant="h4" gutterBottom>
                Users
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

export default Userlist;
