// backend/routes/AuditRoute.js
import express from "express";
import { getAuditLogs } from "../controllers/Audit.js";

const router = express.Router();

router.get('/audits', getAuditLogs);

export default router;
