import express from "express";
import { 
    getCommande,
    getCommandeById,
    createCommande,
    updateCommande,
    deleteCommande,
    validateCommande,
    countCommandes
} from "../controllers/Commandes.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/commandes', verifyUser, getCommande);
router.get('/commandes/count', countCommandes);
router.get('/commandes/:id', verifyUser, getCommandeById);
router.post('/commandes', verifyUser, createCommande);
router.patch('/commandes/:id', verifyUser, updateCommande);
router.delete('/commandes/:id', verifyUser, deleteCommande);
router.patch('/commandes/validate/:id', verifyUser, validateCommande);
export default router;

