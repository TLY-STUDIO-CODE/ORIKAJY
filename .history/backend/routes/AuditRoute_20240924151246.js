// backend/routes/AuditRoute.js
import express from "express";
import { getAuditLogs, getLoginLogs, getActivityLogs, deleteAudit } from "../controllers/Audit.js";

const router = express.Router();

// Route pour récupérer tous les logs d'audit
router.get('/audits', getAuditLogs);

// Route pour récupérer les logs de connexion/déconnexion
router.get('/audits/login', getLoginLogs);

// Route pour récupérer les logs des autres activités
router.get('/audits/activity', getActivityLogs);

// Route pour supprimer un audit par ID
router.delete('/audits/:id', deleteAudit);

export default router;

