import express from 'express';
import { getDepenses } from '../controllers/Depenses.js';

const router = express.Router();

router.get('/depenses/:date', getDepenses);

export default router;
