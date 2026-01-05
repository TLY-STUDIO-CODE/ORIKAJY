import express from 'express';
import { getBeneficeByDate, getTotalBenefice } from '../controllers/Benefice.js';
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

// Bénéfice pour une date spécifique avec vérification de l'utilisateur
router.get('/benefice/:date', verifyUser, getBeneficeByDate);

// Bénéfice total avec vérification de l'utilisateur
router.get('/benefice/total', verifyUser, getTotalBenefice);

export default router;
