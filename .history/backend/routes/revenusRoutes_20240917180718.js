import express from 'express';
import { getRevenus } from '../controllers/Revenus.js';

const router = express.Router();

router.get('/revenus/:date', getRevenus);

export default router;
