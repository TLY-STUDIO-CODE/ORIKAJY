// frontend/components/Audit.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';

const AuditAdmin = () => {
    const [logs, setLogs] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/audits');
                setLogs(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des logs :", error.message);
            }
        };
        fetchLogs();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'action', headerName: 'Action', flex: 1 },
        { field: 'userId', headerName: 'Utilisateur', flex: 1 },
        { field: 'details', headerName: 'Détails', flex: 2 },
        { field: 'timestamp', headerName: 'Timestamp', flex: 1 }
    ];

    const rows = logs.map((log) => ({
        id: log.id,
        action: log.action,
        userId: log.name,
        details: log.details,
        timestamp: new Date(log.timestamp).toLocaleString()
    }));

    return (
        <Box m="20px">
            <Typography variant="h4" gutterBottom>
                Logs d'Audit
            </Typography>
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
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    components={{ Toolbar: GridToolbar }}
                />
            </Box>
        </Box>
    );
};

export default AuditAdmin;
