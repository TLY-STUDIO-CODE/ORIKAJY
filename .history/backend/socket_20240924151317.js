// backend/socket.js
import { Server } from "socket.io";

const socketServer = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("Un utilisateur est connecté");

        // Émettre un événement lors de l'ajout d'un audit
        socket.on("newAudit", (audit) => {
            io.emit("auditLog", audit);
        });

        socket.on("disconnect", () => {
            console.log("Un utilisateur est déconnecté");
        });
    });

    return io;
};

export default socketServer;


