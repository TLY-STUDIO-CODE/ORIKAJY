import Audit from "../models/AuditModel.js";
import User from "../models/UserModel.js";

export const logAudit = async (action, userId, details) => {
    try {
        await Audit.create({ action, userId, details, timestamp: new Date() });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'audit :", error.message);
    }
};

export const getAuditLogs = async (req, res) => {
    try {
        const logs = await Audit.findAll({
            order: [['timestamp', 'DESC']], // Tri par timestamp décroissant
            include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]

        });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteAuditLog = async (req, res) => {
    const { id } = req.params;
    try {
        await Audit.destroy({ where: { id } });
        res.status(200).json({ msg: "Audit supprimé avec succès!" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


