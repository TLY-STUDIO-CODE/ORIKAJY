import React, { useEffect, useState } from 'react';
import { Box, useTheme, IconButton, Modal, Typography, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AuditAdmin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [logs, setLogs] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  useEffect(() => {
    getLogs();
  }, []);

  const getLogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/audits');
      setLogs(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des logs :', error);
    }
  };

  const handleOpenModal = (rowData) => {
    setSelectedRowData(rowData);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRowData(null);
  };

  const handleGenerateInvoice = () => {
    if (selectedRowData) {
      const doc = new jsPDF();
      doc.text('LOG D\'AUDIT', 20, 10);
      doc.text(`Action: ${selectedRowData.action}`, 20, 20);
      doc.text(`Utilisateur: ${selectedRowData.user.name}`, 20, 30);
      doc.text(`Détails: ${selectedRowData.details}`, 20, 40);
      doc.text(`Date: ${new Date(selectedRowData.timestamp).toLocaleString()}`, 20, 50);
      doc.save('audit_log.pdf');
    }
  };

  const deleteLog = async (logId) => {
    try {
      await axios.delete(`http://localhost:5000/audits/${logId}`);
      getLogs();
      toast.success('Log supprimé avec succès!', { autoClose: 5000 });
    } catch (error) {
      toast.error('Erreur lors de la suppression du log.', { autoClose: 5000 });
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'action', headerName: 'Action', flex: 1 },
    { field: 'user', headerName: 'Utilisateur', flex: 1, valueGetter: (params) => params.row.user.name },
    { field: 'details', headerName: 'Détails', flex: 2 },
    { field: 'timestamp', headerName: 'Date', flex: 1, valueGetter: (params) => new Date(params.row.timestamp).toLocaleString() },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleOpenModal(params.row)} color="primary">
            <PrintIcon />
          </IconButton>
          <IconButton onClick={() => deleteLog(params.row.id)} color="secondary">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const rows = logs.map((log) => ({
    id: log.id,
    action: log.action,
    user: log.user,
    details: log.details,
    timestamp: log.timestamp,
  }));

  return (
    <Box m="20px">
      <Header title="LOGS D'AUDIT" subtitle="Liste des logs d'audit" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
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
      {/* Modal pour afficher les détails du log */}
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
            DÉTAILS DU LOG
          </Typography>
          {selectedRowData && (
            <Box>
              <Typography variant="body1">Action: {selectedRowData.action}</Typography>
              <Typography variant="body1">Utilisateur: {selectedRowData.user.name}</Typography>
              <Typography variant="body1">Détails: {selectedRowData.details}</Typography>
              <Typography variant="body1">Date: {new Date(selectedRowData.timestamp).toLocaleString()}</Typography>
            </Box>
          )}
          <Button onClick={handleGenerateInvoice} variant="contained" color="primary" sx={{ mt: 2 }}>
            Imprimer
          </Button>
        </Box>
      </Modal>
      <ToastContainer />
    </Box>
  );
};

export default AuditAdmin;



