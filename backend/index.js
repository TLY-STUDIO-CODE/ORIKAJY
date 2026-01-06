import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import StockRoute from "./routes/StockRoute.js";
import AchatRoute from "./routes/AchatRoute.js";
import CommandeRoute from "./routes/CommandeRoute.js";
import Vente2Route from "./routes/Vente2Route.js";
import AuthRoute from "./routes/AuthRoute.js";
import AuditRoute from "./routes/AuditRoute.js";
import revenusRoute from "./routes/revenusRoutes.js";
import depensesRoute from "./routes/depensesRoutes.js";
import PerteRoute from './routes/PerteRoute.js'; 
import EventRoute from "./routes/EventRoute.js";
import BeneficeRoute from "./routes/BeneficeRoute.js";
import TransactionRoute from "./routes/TransactionRoute.js";
import fileUpload from "express-fileupload";
import AccountingEntryRoute from "./routes/AccountingEntryRoutes.js"
import AccountRoute from "./routes/AccountRoutes.js"
import JournalRoute from "./routes/JournalRoutes.js";
import path from "path";  // Pour travailler avec les chemins de fichiers
import { Server } from "socket.io"; // Importer socket.io


dotenv.config();

const app = express();
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db: db
});

const server = app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running...');
});

// Initialiser Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Assurez-vous que l'URL correspond à votre frontend
        methods: ["GET", "POST"]
    }
});

//(async()=>{
 // await db.sync();
//})();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto',
        httpOnly: true, 
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json());

// Middleware pour gérer le téléchargement des fichiers
app.use(fileUpload({
    createParentPath: true,  // Crée les dossiers parent si nécessaire
}));

// Servir des fichiers statiques (images)
app.use(express.static('public'));

// Utilisation des routes
app.use(UserRoute);
app.use(ProductRoute);
app.use(StockRoute);
app.use(AchatRoute);
app.use(CommandeRoute);
app.use(Vente2Route);
app.use(AuthRoute);
app.use(revenusRoute);
app.use(depensesRoute);
app.use(EventRoute);
app.use(TransactionRoute);
app.use(PerteRoute);
app.use(BeneficeRoute);
app.use(AccountingEntryRoute);
app.use(AccountRoute);
app.use(JournalRoute);
app.use(AuditRoute); // Utiliser la route Audit

// Socket.io pour gérer les notifications en temps réel
io.on('connection', (socket) => {
    console.log('Utilisateur connecté :', socket.id);

    // Événement de déconnexion
    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté :', socket.id);
    });
});


export { io };
//store.sync();


