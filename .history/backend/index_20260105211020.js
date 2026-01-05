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
import path from "path";
import { Server } from "socket.io";

dotenv.config();

const app = express();

// Configuration du store de session
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db: db
});

// CORRECTION : Port dynamique pour Vercel/Render/Railway
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});

// Initialiser Socket.io avec origine dynamique
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        // En production (HTTPS), secure doit être true. 'auto' gère cela.
        secure: process.env.NODE_ENV === "production" ? true : "auto",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        httpOnly: true, 
    }
}));

// Configuration CORS dynamique
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

app.use(express.json());
app.use(fileUpload({ createParentPath: true }));
app.use(express.static('public'));

// Routes
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
app.use(AuditRoute);

io.on('connection', (socket) => {
    console.log('Utilisateur connecté :', socket.id);
    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté :', socket.id);
    });
});

export { io };