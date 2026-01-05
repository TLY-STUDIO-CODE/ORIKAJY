import Audit from "../models/AuditModel.js";
import User from "../models/UserModel.js";

const getUserNameById = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        return user ? user.name_user : "Utilisateur inconnu"; // Retourne le nom de l'utilisateur ou "Utilisateur inconnu" si l'utilisateur n'est pas trouvé
    } catch (error) {
        console.error("Erreur lors de la récupération du nom d'utilisateur :", error.message);
        return "Erreur de récupération"; // Retourne un message d'erreur si une erreur se produit
    }
};

export const logAudit = async (action, userId, details) => {
    try {
        const userName = await getUserNameById(userId); // Récupère le nom de l'utilisateur
        await Audit.create({ action, userId, userName, details, timestamp: new Date() });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'audit :", error.message);
    }
};

export const getAuditLogs = async (req, res) => {
    try {
        const logs = await Audit.findAll({
            order: [['timestamp', 'DESC']] // Tri par timestamp décroissant
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



