import express from 'express';
import { getDepensesByDate, getAllDepenses, getTotalDepenses } from '../controllers/Depenses.js';

const router = express.Router();

// Dépenses pour une date spécifique
router.get('/depenses/:date', getDepensesByDate);

// Toutes les dépenses (liste complète)
router.get('/depenses', getAllDepenses);

// Total cumulé des dépenses
router.get('/depenses/total', getTotalDepenses);

export default router;
