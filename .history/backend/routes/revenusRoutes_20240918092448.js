import express from 'express';
import { getRevenusByDate, getAllRevenus, getTotalRevenus } from '../controllers/Revenus.js';

const router = express.Router();

// Revenu pour une date spécifique
router.get('/revenus/:date', getRevenusByDate);

// Tous les revenus (liste complète)
router.get('/revenus', getAllRevenus);


export default router;

