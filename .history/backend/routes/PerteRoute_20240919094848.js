import express from 'express';
import { getPertesByDate, getAllPertes, getTotalPertes } from '../controllers/Pertes.js';
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

// Pertes pour une date spécifique avec vérification de l'utilisateur
router.get('/pertes/:date', verifyUser, getPertesByDate);

// Toutes les pertes avec vérification de l'utilisateur
router.get('/pertes', verifyUser, getAllPertes);

// Total cumulé des pertes avec vérification de l'utilisateur
router.get('/pertes/total', verifyUser, getTotalPertes);

export default router;
