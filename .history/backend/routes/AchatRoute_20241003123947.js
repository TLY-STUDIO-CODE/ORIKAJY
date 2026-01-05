import express from "express";
import { 
    getAchats,
    getAchatById,
    createAchat,
    updateAchat,
    deleteAchat,
    validateAchat,
    countAchats 
} from "../controllers/Achats.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/achats', verifyUser, getAchats);
router.get('/achats/count', countAchats);
router.get('/achats/:id', verifyUser, getAchatById);
router.post('/achats', verifyUser, createAchat);
router.patch('/achats/:id', verifyUser, updateAchat);
router.delete('/achats/:id', verifyUser, deleteAchat);
router.patch('/achats/validate/:id', verifyUser, validateAchat);

export default router;
