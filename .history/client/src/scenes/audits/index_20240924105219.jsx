// Audit.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import io from 'socket.io-client';

const socket = io("http://localhost:5000");

const Audit = () => {
const [auditLogs, setAuditLogs] = useState([]);
const theme = useTheme();
const colors = tokens(theme.palette.mode);

useEffect(() => {
socket.on("user-action-log", (actionLog) => {
    setAuditLogs((prevLogs) => [...prevLogs, actionLog]);
});

return () => {
    socket.off("user-action-log");
};
}, []);

const columns = [
{ field: "id", headerName: "ID", width: 90 },
{ field: "userId", headerName: "User ID", flex: 1 },
{ field: "action", headerName: "Action", flex: 2 },
{ field: "timestamp", headerName: "Timestamp", flex: 2 },
];

const rows = auditLogs.map((log, index) => ({
id: index + 1,
userId: log.userId,
action: log.action,
timestamp: new Date(log.timestamp).toLocaleString(),
}));

return (
<Box m="20px">
    <Typography variant="h4">Audit Log</Typography>
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
    }}
    >
    <DataGrid rows={rows} columns={columns} pageSize={10} />
    </Box>
</Box>
);
};

export default Audit;
