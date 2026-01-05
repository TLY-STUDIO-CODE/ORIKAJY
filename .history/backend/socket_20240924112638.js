// backend/socket.js
import { Server } from "socket.io";
import http from "http";

const socketServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log('Un utilisateur est connecté :', socket.id);

        socket.on("user-action", (data) => {
            console.log("Action utilisateur reçue :", data);
            // Enregistrez l'action dans la base de données
        });

        socket.on("disconnect", () => {
            console.log('Utilisateur déconnecté :', socket.id);
        });
    });

    return io;
};

export default socketServer;


