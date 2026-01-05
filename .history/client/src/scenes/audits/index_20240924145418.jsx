// frontend/components/AuditPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';

const AuditPage = () => {
    const [loginLogs, setLoginLogs] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const loginResponse = await axios.get('http://localhost:5000/audits/login-logs');
                const activityResponse = await axios.get('http://localhost:5000/audits/activity-logs');
                setLoginLogs(loginResponse.data);
                setActivityLogs(activityResponse.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des logs :", error.message);
            }
        };
        fetchLogs();
    }, []);

    const deleteLog = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/audits/${id}`);
            setLoginLogs(prev => prev.filter(log => log.id !== id));
            setActivityLogs(prev => prev.filter(log => log.id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression du log :", error.message);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'action', headerName: 'Action', flex: 1 },
        { field: 'userId', headerName: 'Utilisateur', flex: 1 },
        { field: 'details', headerName: 'Détails', flex: 2 },
        { field: 'timestamp', headerName: 'Timestamp', flex: 1 },
        {
            field: 'delete', headerName: 'Supprimer', flex: 1, renderCell: (params) => (
                <Button variant="contained" color="secondary" onClick={() => deleteLog(params.row.id)}>
                    Supprimer
                </Button>
            )
        }
    ];

    const formatRows = (logs) => logs.map((log) => ({
        id: log.id,
        action: log.action,
        userId: log.userId,
        details: log.details,
        timestamp: new Date(log.timestamp).toLocaleString()
    }));

    return (
        <Box m="20px">
            {/* Login Logs Section */}
            <Typography variant="h4" gutterBottom>
                Logs de Connexion
            </Typography>
            <Box m="40px 0 20px 0" height="40vh">
                <DataGrid
                    rows={formatRows(loginLogs)}
                    columns={columns}
                    pageSize={5}
                    components={{ Toolbar: GridToolbar }}
                    sx={{
                        "& .MuiDataGrid-root": { border: "none" },
                        "& .MuiDataGrid-cell": { borderBottom: "none" },
                        "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700] },
                        "& .MuiDataGrid-footerContainer": { backgroundColor: colors.blueAccent[700] },
                    }}
                />
            </Box>

            {/* Activity Logs Section */}
            <Typography variant="h4" gutterBottom>
                Logs d'Activités
            </Typography>
            <Box m="40px 0 0 0" height="40vh">
                <DataGrid
                    rows={formatRows(activityLogs)}
                    columns={columns}
                    pageSize={5}
                    components={{ Toolbar: GridToolbar }}
                    sx={{
                        "& .MuiDataGrid-root": { border: "none" },
                        "& .MuiDataGrid-cell": { borderBottom: "none" },
                        "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700] },
                        "& .MuiDataGrid-footerContainer": { backgroundColor: colors.blueAccent[700] },
                    }}
                />
            </Box>
        </Box>
    );
};

export default AuditPage;

