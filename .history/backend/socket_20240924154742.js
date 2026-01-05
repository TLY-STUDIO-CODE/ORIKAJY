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

        // Gérer les événements de déconnexion
        socket.on("disconnect", () => {
            console.log("Un utilisateur est déconnecté");
        });
    });

    return io;
};

export default socketServer;



