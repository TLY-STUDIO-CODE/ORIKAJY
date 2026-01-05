import express from 'express';
import { getRevenusByDate, getAllRevenus, getTotalRevenus, getTotalVente } from '../controllers/Revenus.js';

const router = express.Router();

// Revenu pour une date spécifique
router.get('/revenus/:date', getRevenusByDate);

// Tous les revenus (liste complète)
router.get('/revenus', getAllRevenus);

// Total de tous les revenus
router.get('/revenus/total', getTotalRevenus);

// Total de tous les revenus
router.get('/ventes/total', getTotalRevenus);


export default router;

