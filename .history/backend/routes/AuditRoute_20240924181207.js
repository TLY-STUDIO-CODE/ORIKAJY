// backend/routes/AuditRoute.js
import express from "express";
import { getAuditLogs, deleteAuditLog } from "../controllers/Audit.js";

const router = express.Router();

router.get('/audits', getAuditLogs);
router.delete('/audits/:id', deleteAuditLog); 

export default router;
