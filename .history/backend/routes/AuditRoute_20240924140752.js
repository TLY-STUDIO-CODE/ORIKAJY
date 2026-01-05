import express from 'express';
import { getAuditLogs, getLoginLogs, getActivityLogs, deleteAudit } from '../controllers/Audit.js';

const router = express.Router();

router.get('/audits', getAuditLogs);
router.get('/audits/logins', getLoginLogs); // Route pour les logs de connexion
router.get('/audits/activities', getActivityLogs); // Route pour les autres activités
router.delete('/audits/:id', deleteAudit); // Route pour supprimer un audit

export default router;
