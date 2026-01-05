import express from 'express';
import { getRevenusByDate, getAllRevenus} from '../controllers/Revenus.js';
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

// Revenu pour une date spécifique avec vérification de l'utilisateur
router.get('/revenus/:date', verifyUser, getRevenusByDate);

// Tous les revenus avec vérification de l'utilisateur
router.get('/revenus', verifyUser, getAllRevenus);


export default router;



