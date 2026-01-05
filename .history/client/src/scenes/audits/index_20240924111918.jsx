// Audit.jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";

const socket = io('http://localhost:5000'); // URL de votre serveur Socket.IO

const AuditAdmin = () => {
const [userStatus, setUserStatus] = useState([]);
const [userActivities, setUserActivities] = useState([]);


const statusColumns = [
{ field: 'userId', headerName: 'User ID', width: 150 },
{ field: 'status', headerName: 'Status', width: 150 },
];

const activityColumns = [
{ field: 'userId', headerName: 'User ID', width: 150 },
{ field: 'activity', headerName: 'Activity', flex: 1 },
];

const statusRows = userStatus.map((item, index) => ({
id: index + 1,
userId: item.userId,
status: item.status
}));

const activityRows = userActivities.map((item, index) => ({
id: index + 1,
userId: item.userId,
activity: item.activity
}));

return (
<Box m="20px">
    <Typography variant="h4">User Status</Typography>
    <Box
    m="20px 0"
    height="40vh"
    sx={{
        "& .MuiDataGrid-root": {
        border: "none",
        },
        "& .MuiDataGrid-cell": {
        borderBottom: "none",
        },
        "& .MuiDataGrid-columnHeaders": {
        backgroundColor: tokens.blueAccent[700],
        borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
        backgroundColor: tokens.primary[400],
        },
        "& .MuiDataGrid-footerContainer": {
        borderTop: "none",
        backgroundColor: tokens.blueAccent[700],
        },
    }}
    >
    <DataGrid
        rows={statusRows}
        columns={statusColumns}
        pageSize={10}
        checkboxSelection
    />
    </Box>
    
    <Typography variant="h4">User Activities</Typography>
    <Box
    m="20px 0"
    height="40vh"
    sx={{
        "& .MuiDataGrid-root": {
        border: "none",
        },
        "& .MuiDataGrid-cell": {
        borderBottom: "none",
        },
        "& .MuiDataGrid-columnHeaders": {
        backgroundColor: tokens.blueAccent[700],
        borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
        backgroundColor: tokens.primary[400],
        },
        "& .MuiDataGrid-footerContainer": {
        borderTop: "none",
        backgroundColor: tokens.blueAccent[700],
        },
    }}
    >
    <DataGrid
        rows={activityRows}
        columns={activityColumns}
        pageSize={10}
        checkboxSelection
    />
    </Box>
</Box>
);
};

export default AuditAdmin;
