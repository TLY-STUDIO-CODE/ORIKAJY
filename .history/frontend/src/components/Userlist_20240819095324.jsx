import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button } from '@mui/material';

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
        { field: 'id', headerName: 'No', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'role', headerName: 'Role', width: 120 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <>
                    <Link to={`/users/edit/${params.row.uuid}`}>
                        <Button variant="contained" color="primary" size="small" style={{ marginRight: 8 }}>
                            Edit
                        </Button>
                    </Link>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => deleteUser(params.row.uuid)}
                    >
                        Delete
                    </Button>
                </>
            )
        }
    ];

    const rows = users.map((user, index) => ({
        id: index + 1,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role
    }));

    return (
        <div style={{ height: 400, width: '100%' }}>
            <h1 className="title">Users</h1>
            <h2 className="subtitle">List of Users</h2>
            <Link to="/users/add" className="button is-primary mb-2">Add New</Link>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                components={{ Toolbar: GridToolbar }}
            />
        </div>
    );
};

export default Userlist;
