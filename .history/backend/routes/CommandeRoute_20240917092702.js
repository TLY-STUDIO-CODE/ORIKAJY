import express from "express";
import { 
    getCommande,
    getCommandeById,
    createCommande,
    updateCommande,
    deleteCommande
} from "../controllers/Commandes.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/commandes', verifyUser, getCommande);
router.get('/commandes/:id', verifyUser, getCommandeById);
router.post('/commandes', verifyUser, createCommande);
router.patch('/commandes/:id', verifyUser, updateCommande);
router.delete('/commandes/:id', verifyUser, deleteCommande);

export default router;

