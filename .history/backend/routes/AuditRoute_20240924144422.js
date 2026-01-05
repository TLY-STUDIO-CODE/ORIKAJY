import express from 'express';
import { logAudit, getAuditLogs, getLoginLogs, getActivityLogs, deleteAudit } from '../controllers/Audit.js';

const router = express.Router();

// Routes
router.post('/audits', logAudit);
router.get('/audits', getAuditLogs);
router.get('/audits/login-logs', getLoginLogs);
router.get('/audits/activity-logs', getActivityLogs);
router.delete('/audits/:id', deleteAudit);

export default router;
