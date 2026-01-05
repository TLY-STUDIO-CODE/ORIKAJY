import express from "express";
import { 
    getAuditLogs, 
    getLoginLogs, 
    getActivityLogs, 
    logAudit, 
    deleteAudit 
} from "../controllers/Audit.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

// Route pour récupérer tous les logs d'audit
router.get('/audits', verifyUser, getAuditLogs);

// Route pour récupérer uniquement les logs de connexion/déconnexion
router.get('/audits/login', verifyUser, getLoginLogs);

// Route pour récupérer les logs des autres activités
router.get('/audits/activity', verifyUser, getActivityLogs);

// Route pour ajouter un nouveau log d'audit
router.post('/audits', verifyUser, async (req, res) => {
    const { action, userId, details } = req.body;
    try {
        await logAudit(action, userId, details);
        res.status(201).json({ message: "Log d'audit ajouté avec succès" });
    } catch (error) {
        res.status(500).json({ message: `Erreur lors de l'ajout du log d'audit : ${error.message}` });
    }
});

// Route pour supprimer un log d'audit spécifique par son ID
router.delete('/audits/:id', verifyUser, deleteAudit);

export default router;



