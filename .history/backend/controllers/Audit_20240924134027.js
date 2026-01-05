// backend/controllers/Audit.js
import Audit from "../models/AuditModel.js";
import User from "../models/UserModel.js"; // Import du modèle utilisateur

// Fonction pour enregistrer un audit
export const logAudit = async (action, userId, details) => {
    try {
        await Audit.create({ action, userId, details, timestamp: new Date() });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'audit :", error.message);
    }
};

// Fonction pour récupérer les journaux d'audit
export const getAuditLogs = async (req, res) => {
    try {
        const logs = await Audit.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['name', 'email'] // Récupérer le nom et l'email de l'utilisateur
            }],
            order: [['timestamp', 'DESC']] // Tri par timestamp décroissant
        });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Fonction pour supprimer un audit par ID
export const deleteAudit = async (req, res) => {
    const { id } = req.params;
    try {
        const audit = await Audit.findByPk(id); // Trouver l'audit par ID
        if (!audit) {
            return res.status(404).json({ msg: "Audit non trouvé" });
        }
        await audit.destroy(); // Supprimer l'audit
        res.status(200).json({ msg: "Audit supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


