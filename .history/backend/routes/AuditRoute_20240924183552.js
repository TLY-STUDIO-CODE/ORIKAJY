// backend/routes/AuditRoute.js
import express from "express";
import { getAuditLogs, deleteAuditLog } from "../controllers/Audit.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/audits',verifyUser, adminOnly, getAuditLogs);
router.delete('/audits/:id',verifyUser, adminOnly, deleteAuditLog); 

export default router;
