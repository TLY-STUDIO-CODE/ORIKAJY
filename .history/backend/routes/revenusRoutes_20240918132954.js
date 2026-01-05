import express from 'express';
import { getRevenusByDate, getAllRevenus, getTotalRevenus, getTotalVenteByDate } from '../controllers/Revenus.js';
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/revenus/:date', verifyUser, getRevenusByDate);
router.get('/revenus', verifyUser, getAllRevenus);
router.get('/revenus/total', verifyUser, getTotalRevenus);
router.get('/ventes/:date', verifyUser, getTotalVenteByDate);

export default router;



