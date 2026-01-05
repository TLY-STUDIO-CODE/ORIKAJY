import express from 'express';
import { getDepensesByDate, getAllDepenses, getTotalDepenses } from '../controllers/Depenses.js';
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

// Dépenses pour une date spécifique avec vérification de l'utilisateur
router.get('/depenses/:date', verifyUser, getDepensesByDate);

// Toutes les dépenses avec vérification de l'utilisateur
router.get('/depenses', verifyUser, getAllDepenses);

// Total cumulé des dépenses avec vérification de l'utilisateur
router.get('/depenses/total', verifyUser, getTotalDepenses);

export default router;

