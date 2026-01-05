import express from 'express';
import { getRevenusByDate, getAllRevenus } from '../controllers/revenus.js';

const router = express.Router();

// Récupérer les revenus pour une date spécifique
router.get('/revenus/:date', getRevenusByDate);

// Récupérer tous les revenus
router.get('/revenus', getAllRevenus);

export default router;




