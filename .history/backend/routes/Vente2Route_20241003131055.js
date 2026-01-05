import express from "express";
import { 
    getVentes2,
    getVente2ById,
    createVente2,
    updateVente2,
    deleteVente2,
    validateVente,
    countVentes2
} from "../controllers/Ventes2.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/ventes2', verifyUser, getVentes2);
router.get('/ventes2/count', verifyUser,  countVentes2);
router.get('/ventes2/:id', verifyUser, getVente2ById);
router.post('/ventes2', verifyUser, createVente2);
router.patch('/ventes2/:id', verifyUser, updateVente2);
router.delete('/ventes2/:id', verifyUser, deleteVente2);
router.patch('/ventes2/validate/:id', verifyUser, validateVente);
export default router;
