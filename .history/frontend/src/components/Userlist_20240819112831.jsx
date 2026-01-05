import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Typography, IconButton } from "@mui/material";

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
        <Box m="40px 0 0 0" height="75vh" sx={{
            "& .MuiDataGrid-root": {
                border: "none",
            },
            "& .MuiDataGrid-cell": {
                borderBottom: "none",
            },
            "& .name-column--cell": {
                color: "#4caf50",
            },
            "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#1565c0",
                borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
                backgroundColor: "#1e88e5",
            },
            "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: "#1565c0",
            },
            "& .MuiCheckbox-root": {
                color: "#4caf50 !important",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: "#ffffff !important",
            },
        }}>
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
