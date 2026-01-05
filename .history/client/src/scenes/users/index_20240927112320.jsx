import { Box, Typography, useTheme, IconButton, Modal, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import React, { useEffect, useState } from 'react';
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom"; // Pour rediriger vers la page d'édition
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';
import axios from "axios";
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Users = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { isError, user } = useSelector((state => state.auth));
const [selectedUsers, setSelectedUsers] = useState(null);
const [openDeleteModal, setOpenDeleteModal] = useState(false);

useEffect(() => {
    dispatch(getMe());
}, [dispatch]);

useEffect(() => {
    if (isError) {
        navigate("/");
    }
    if (user && user.role !== "admin") {
        navigate("/dashboard");
    }
}, [isError, user, navigate]);

  const [users, setUsers] = useState([]);

  useEffect(() => {
      getUsers();
  }, []);

  const getUsers = async () => {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
  };

  const deleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/users/${userId}`);
            getUsers();
            toast.success("Utilisateur supprimé avec succès!", {
                autoClose: 10000, // 30 seconds
            });
        } catch (error) {
            toast.error("Erreur lors de la suppression de l'utilisateur.", {
                autoClose: 10000
            });
        }
    };
const handleOpenDeleteModal = (user) => {
    setSelectedUsers(user);
    setOpenDeleteModal(true);
};

const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedUsers(null);
};


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
        field: "name",
        headerName: "Nom",
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
        headerName: "Rôle",
        flex: 1,
        renderCell: ({ row: { role } }) => (
      <Box
        width="60%"
        m="0 auto"
        p="5px"
        display="flex"
        justifyContent="center"
        backgroundColor={
          role === "admin"
            ? colors.greenAccent[600]
              : role === "manager"
              ? colors.greenAccent[700]
              : colors.greenAccent[700]
        }
        borderRadius="4px"
      >
          {role === "admin" && <AdminPanelSettingsOutlinedIcon />}
          {role === "manager" && <SecurityOutlinedIcon />}
          {role === "user" && <LockOpenOutlinedIcon />}
        <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
          {role}
        </Typography>
      </Box>
    ),
    },
    {
        field: "image",
        headerName: "Photo",
        width: 100,
        renderCell: (params) => (
            <img src={`http://localhost:5000${params.row.image}`} alt="User" style={{ width: 50, height: 50, borderRadius: '50%' }} />
        ),
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
                    color="secondary"
                >
                    <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleOpenDeleteModal(params.row)} color="secondary">
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
    image: user.image, // Ajoutez l'image ici
    status: user.status // Stat
  }));

  return (
    <Box m="20px">
      <Header title="UTILISATEURS" subtitle="Liste de tous les utilisateurs de l'application" />
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
      <DataGrid 
          rows={rows} 
          columns={columns} 
          pageSize={10} 
          checkboxSelection 
          components={{ Toolbar: GridToolbar }} 
      />
      </Box>
      {/* Modal de confirmation de suppression */}
            <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
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
                    <Typography variant="h6" component="h2">
                        Confirmer la suppression
                    </Typography>
                    <Typography variant="body1">
                        Êtes-vous sûr de vouloir supprimer cet utilisateur ?
                    </Typography>
                    <Box mt={2}>
                        <Button onClick={() => {
                            deleteUser(selectedUsers.id);
                        }} variant="contained" color="secondary" sx={{ mr: 2 }}>
                            Supprimer
                        </Button>
                        <Button onClick={handleCloseDeleteModal} variant="outlined" color="secondary">
                            Annuler
                        </Button>
                    </Box>
                </Box>
            </Modal>
      <ToastContainer />
    </Box>
  );
};

export default Users;

