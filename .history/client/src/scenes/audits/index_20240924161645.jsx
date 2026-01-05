import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Modal, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import io from 'socket.io-client';
import axios from 'axios';
import Header from '../../components/Header';

const socket = io('http://localhost:5000');

const AuditAdmin = () => {
  const [logs, setLogs] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    // Récupérer les logs au chargement du composant
    fetchLogs();

    // Écouter les événements de Socket.IO
    socket.on('newAudit', (newAudit) => {
      setLogs((prevLogs) => [newAudit, ...prevLogs]);
    });

    socket.on('deleteAudit', ({ id }) => {
      setLogs((prevLogs) => prevLogs.filter(log => log.id !== id));
    });

    return () => {
      socket.off('newAudit');
      socket.off('deleteAudit');
    };
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/audits');
      setLogs(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des logs:', error.message);
    }
  };

  const handleOpenModal = (log) => {
    setSelectedLog(log);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedLog(null);
  };

  const deleteLog = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/audits/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du log:', error.message);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'action', headerName: 'Action', flex: 1 },
    { field: 'userName', headerName: 'Utilisateur', flex: 1 },
    { field: 'details', headerName: 'Détails', flex: 2 },
    { field: 'timestamp', headerName: 'Date', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Button onClick={() => handleOpenModal(params.row)}>Voir</Button>
          <Button onClick={() => deleteLog(params.row.id)}>Supprimer</Button>
        </Box>
      ),
    },
  ];

  const rows = logs.map((log) => ({
    id: log.id,
    action: log.action,
    userName: log.User.name,
    details: log.details,
    timestamp: new Date(log.timestamp).toLocaleString(),
  }));

  return (
    <Box m="20px">
      <Header title="LOGS D'AUDIT" subtitle="Liste des logs d'audit" />
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
        <DataGrid 
          rows={rows} 
          columns={columns} 
          pageSize={10} 
          checkboxSelection 
          components={{ Toolbar: GridToolbar }} 
        />
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Détails du log d'audit
          </Typography>
          {selectedLog && (
            <Box>
              <Typography variant="body1">Action: {selectedLog.action}</Typography>
              <Typography variant="body1">Utilisateur: {selectedLog.User.name}</Typography>
              <Typography variant="body1">Détails: {selectedLog.details}</Typography>
              <Typography variant="body1">Date: {new Date(selectedLog.timestamp).toLocaleString()}</Typography>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default AuditAdmin;



