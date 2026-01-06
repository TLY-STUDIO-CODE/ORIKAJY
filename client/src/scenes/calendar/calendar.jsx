import { Box, Typography, useTheme, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Tooltip, Button, List, ListItem, ListItemText } from "@mui/material";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


const Calendar = () => {
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
  const [setMsg] = useState("");

  const [selectedEvent, setSelectedEvent] = useState(null);

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
          try {await axios.post('http://localhost:5000/events', newEvent);
          getEvents();
          toast.success("L'événement est créé avec succès!", {
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
    if (window.confirm(`Vous êtes sur de vouloir supprimer l'événement '${event.title}'?`)) {
      try {
        await axios.delete(`http://localhost:5000/events/${event.uuid}`);
        getEvents();
        toast.success("L'événement est supprimé avec succès!");
      } catch (error) {
        toast.error('Error deleting the event.');
        console.error("Erreur lors de la suppression de l'événement:", error);
      }
    }
  };



  return (
    <Box m="20px">
      <Header title="CALENDRIER" subtitle="Calendrier pour noter les événements importants dans l'application" />

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Evénements</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                  transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' }
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                          {formatDate(event.start, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          -{" "}
                          {formatDate(event.end, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                    </Typography>
                  }
                />
                <Tooltip title="Modifier l'événement">
                  <IconButton onClick={() => handleEditEvent(event)} color="primary">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Supprimer l'événement">
                  <IconButton onClick={() => handleDeleteEvent(event)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleDeleteEvent}
            events={currentEvents.map(event => ({
              id: event.uuid,
              title: event.title,
              start: event.start,
              end: event.end,
              allDay: event.allDay,
              createdBy: event.user.name,
            }))}
          />
        </Box>
      </Box>

      {/* Dialog for event form */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{dialogMode === 'add' ? 'Ajouter un événement' : 'Modifier un événement'}</DialogTitle>
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

export default Calendar;
