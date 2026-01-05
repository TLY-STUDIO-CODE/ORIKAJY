// backend/routes/auditRoute.js
import express from "express";
import { logAudit, getAuditLogs, deleteAudit } from "../controllers/Audit.js";

const router = express.Router();

// Route pour récupérer tous les logs d'audit
router.get('/audits', getAuditLogs);

// Route pour supprimer un audit par ID
router.delete('/audits/:id', deleteAudit);

export default router;
