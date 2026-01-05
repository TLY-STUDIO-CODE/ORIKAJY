// socket.js
import { Server } from "socket.io";

const initializeSocket = (server) => {
const io = new Server(server, {
cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
},
});

io.on("connection", (socket) => {
console.log("Un utilisateur est connecté");

// Événement de connexion
socket.on("user-connected", (user) => {
    console.log(`${user.name} est connecté`);
    io.emit("user-status", { ...user, status: "connecté" });
});

// Événement de déconnexion
socket.on("disconnect", () => {
    console.log("Un utilisateur est déconnecté");
    io.emit("user-status", { name: socket.userName, status: "déconnecté" });
});

// Événement pour suivre les actions des utilisateurs
socket.on("user-action", (action) => {
    console.log(`Action de l'utilisateur : ${action}`);
    io.emit("user-action-log", action);
});
});

return io;
};

export default initializeSocket;
