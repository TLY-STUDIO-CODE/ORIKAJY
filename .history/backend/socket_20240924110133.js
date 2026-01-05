// socket.js
import { Server } from "socket.io";

const socketHandler = (server) => {
const io = new Server(server, {
cors: {
    origin: 'http://localhost:3000', // URL de votre frontend
    methods: ["GET", "POST"]
}
});

// Connexion d'un utilisateur
io.on('connection', (socket) => {
console.log(`User connected: ${socket.id}`);

// Événement pour la connexion d'un utilisateur
socket.on('userConnected', (userId) => {
    console.log(`User ${userId} connected`);
    io.emit('userStatus', { userId, status: 'connected' });
});

// Événement pour la déconnexion d'un utilisateur
socket.on('userDisconnected', (userId) => {
    console.log(`User ${userId} disconnected`);
    io.emit('userStatus', { userId, status: 'disconnected' });
});

// Événement pour suivre les activités des utilisateurs
socket.on('userActivity', (data) => {
    console.log(`Activity from user ${data.userId}: ${data.activity}`);
    io.emit('userActivity', data);
});

// Déconnexion d'un utilisateur
socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
});
});

return io;
};

export default socketHandler;

