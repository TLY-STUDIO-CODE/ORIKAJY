import express from 'express';
import { getRevenusByDate, getAllRevenus, getTotalRevenus, getTotalVenteByDate } from '../controllers/Revenus.js';
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

// Revenu pour une date spécifique avec vérification de l'utilisateur
router.get('/revenus/:date', verifyUser, getRevenusByDate);

// Tous les revenus avec vérification de l'utilisateur
router.get('/revenus', verifyUser, getAllRevenus);

// Total cumulé des revenus avec vérification de l'utilisateur
router.get('/revenus/total', verifyUser, getTotalRevenus);

// Total des ventes pour une date spécifique avec vérification de l'utilisateur
router.get('/ventes/:date', verifyUser, getTotalVenteByDate);

export default router;



