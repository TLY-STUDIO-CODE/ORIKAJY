import express from 'express';
import { getRevenusByDate, getAllRevenus, getTotalRevenus, getTotalVenteByDate } from '../controllers/Revenus.js';

const router = express.Router();

// Revenu pour une date spécifique
router.get('/revenus/:date', getRevenusByDate);

// Tous les revenus (liste complète)
router.get('/revenus', getAllRevenus);

// Total de tous les revenus
router.get('/revenus/total', getTotalRevenus);

// Total des ventes pour une date spécifique
router.get('/ventes/:date', getTotalVenteByDate);
export default router;

