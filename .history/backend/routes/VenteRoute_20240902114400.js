import express from "express";
import { 
    getVentes,
    getVenteById,
    createVente,
    updateVente,
    deleteVente 
} from "../controllers/Ventes.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/ventes', verifyUser, getVentes);
router.get('/ventes/:id', verifyUser, getVenteById);
router.post('/ventes', verifyUser, createVente);
router.patch('/ventes/:id', verifyUser, updateVente);
router.delete('/ventes/:id', verifyUser, deleteVente);

export default router;
