import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton } from '@mui/material';

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
        { field: 'id', headerName: 'No', width: 70 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'role', headerName: 'Role', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box>
                    <Link to={`/users/edit/${params.row.uuid}`}>
                        <IconButton color="primary">
                            <EditIcon />
                        </IconButton>
                    </Link>
                    <IconButton color="secondary" onClick={() => deleteUser(params.row.uuid)}>
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
        <div>
            <h1 className="title">Users</h1>
            <h2 className="subtitle">List of Users</h2>
            <Link to="/users/add" className="button is-primary mb-2">Add New</Link>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    components={{ Toolbar: GridToolbar }}
                />
            </Box>
        </div>
    );
};

export default Userlist;
