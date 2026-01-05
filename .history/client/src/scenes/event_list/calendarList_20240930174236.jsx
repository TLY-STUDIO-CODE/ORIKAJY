import { Box, Typography, useTheme, Tooltip, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { formatDate } from "@fullcalendar/react";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CalendarList = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { isError } = useSelector((state) => state.auth);
const theme = useTheme();
const colors = tokens(theme.palette.mode);
const [currentEvents, setCurrentEvents] = useState([]);
const [openDialog, setOpenDialog] = useState(false);
const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
const [eventDetails, setEventDetails] = useState({
title: '',
start: '',
end: '',
allDay: false
});
const [selectedEvent, setSelectedEvent] = useState(null);
 const [msg, setMsg] = useState("");

useEffect(() => {
dispatch(getMe());
}, [dispatch]);

useEffect(() => {
if (isError) {
    navigate("/");
}
}, [isError, navigate]);

useEffect(() => {
getEvents();
}, []);

const getEvents = async () => {
try {
    const response = await axios.get('http://localhost:5000/events');
    setCurrentEvents(response.data);
} catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
}
};

const handleDateClick = (selected) => {
setDialogMode('add');
setEventDetails({
    title: '',
    start: selected.startStr,
    end: selected.endStr,
    allDay: selected.allDay
});
setOpenDialog(true);
};

const handleDialogClose = () => {
setOpenDialog(false);
};

const handleDialogSave = async () => {
if (dialogMode === 'add') {
    try {
    const newEvent = {
        ...eventDetails,
        createdBy: '', // Remplacez par les données réelles de l'utilisateur
        dateAdded: new Date().toISOString(),
    };

    const existingEvents = currentEvents.filter(event => 
        event.start === newEvent.start && event.end === newEvent.end
    );
    if (existingEvents.length === 0) {
        const response = await axios.post('http://localhost:5000/events', newEvent);
        getEvents();
    } else {
        console.log("L'événement existe déjà à cette date.");
    }
    } catch (error) {
    console.error("Erreur lors de la création de l'événement:", error);
    }
} else if (dialogMode === 'edit' && selectedEvent) {
    try {
    const updatedEvent = { ...selectedEvent, ...eventDetails };
    await axios.patch(`http://localhost:5000/events/${selectedEvent.uuid}`, updatedEvent);
    getEvents();
    toast.success("L'événement est mis à jour avec succès!", {
                autoClose: 10000, // 30 seconds
            });
        setTimeout(() => {
                navigate("/calendar");
            }, 2000); // Un petit délai avant la navigation
    } catch (error) {
        if(error.response) {
            setMsg(error.response.data.msg);
            toast.error(error.response.data.msg, {
                    autoClose: 10000, // 30 seconds
                });
        }
    }
}else {
        console.log("L'événement existe déjà à cette date.");
    } 
handleDialogClose();
};


const handleEditEvent = (event) => {
setDialogMode('edit');
setSelectedEvent(event);
setEventDetails({
    title: event.title,
    start: event.start,
    end: event.end,
    allDay: event.allDay
});
setOpenDialog(true);
};

const handleDeleteEvent = async (event) => {
if (window.confirm(`Vous êtes vraiment sur de vouloir supprimer l'événement '${event.title}'?`)) {
    try {
    await axios.delete(`http://localhost:5000/events/${event.uuid}`);
    getEvents();
    } catch (error) {
    console.error("Erreur lors de la suppression de l'événement:", error);
    }
}
};

const handleEventClick = async (selected) => {
if (window.confirm(`Are you sure you want to delete the event '${selected.event.title}'`)) {
    try {
    await axios.delete(`http://localhost:5000/events/${selected.event.id}`);
    selected.event.remove();
    getEvents();
    } catch (error) {
    console.error("Erreur lors de la suppression de l'événement:", error);
    }
}
};

const columns = [
{ field: "id", headerName: "ID", width: 90 },
{
    field: "title",
    headerName: "Titre de l'événement",
    flex: 1,
},
{
    field: "start",
    headerName: "Date de début",
    flex: 1,
},
{
    field: "end",
    headerName: "Date de fin ",
    flex: 1,
},
{
    field: "createdBy",
    headerName: "Créé par",
    flex: 1,
},
{
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: (params) => (
    <Box>
        <IconButton
        color="primary"
        onClick={() => handleEditEvent(params.row)}
        >
        <EditIcon />
        </IconButton>
        <IconButton
        color="secondary"
        onClick={() => handleDeleteEvent(params.row)}
        >
        <DeleteIcon />
        </IconButton>
    </Box>
    ),
},
];

const rows = currentEvents.map((event, index) => ({
id: index + 1,
uuid: event.uuid,
title: event.title,
start: formatDate(event.start, { year: "numeric", month: "short", day: "numeric" }),
end: formatDate(event.end, { year: "numeric", month: "short", day: "numeric" }),
createdBy: event.user.name,
}));

return (
<Box m="20px">
    <Header title="EVENEMENTS" subtitle="Liste de tous les événements notés par un utilisateur" />

    <Box display="flex" justifyContent="space-between" sx={{height: '75vh'}}>
    {/* DATA TABLE */}
    <Box
        flex="1 1 45%"
        backgroundColor={colors.primary[400]}
        p="15px"
        borderRadius="4px"
        sx={{ height: '100%' }}
    >
        <Typography variant="h5">Tableau des événements</Typography>
        <Box
        m="40px 0 0 0"
        height="100%"
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
    </Box>
    </Box>

    {/* Dialog for event form */}
    <Dialog open={openDialog} onClose={handleDialogClose}>
    <DialogTitle>{dialogMode === 'add' ? 'Add Event' : 'Edit Event'}</DialogTitle>
    <DialogContent>
        <TextField
        autoFocus
        margin="dense"
        label="Titre de l'événement"
        fullWidth
        variant="outlined"
        value={eventDetails.title}
        onChange={(e) => setEventDetails({...eventDetails, title: e.target.value})}
        />
        <TextField
        margin="dense"
        fullWidth
        variant="outlined"
        type="datetime-local"
        value={eventDetails.start}
        onChange={(e) => setEventDetails({...eventDetails, start: e.target.value})}
        />
        <TextField
        margin="dense"
        fullWidth
        variant="outlined"
        type="datetime-local"
        value={eventDetails.end}
        onChange={(e) => setEventDetails({...eventDetails, end: e.target.value})}
        />
    </DialogContent>
    <DialogActions>
        <Button onClick={handleDialogClose}>Annuler</Button>
        <Button onClick={handleDialogSave}>Enregistrer</Button>
    </DialogActions>
    </Dialog>
    {/* Toast container */}
    <ToastContainer />
</Box>
);
};

export default CalendarList;
