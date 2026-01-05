import express from "express";
import { createVente, getVentes } from "../controllers/Ventes.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.post('/ventes', verifyUser, createVente);
router.get('/ventes', verifyUser, getVentes);

export default router;
