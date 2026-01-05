// backend/controllers/AuditController.js
import Audit from "../models/AuditModel.js";
import User from "../models/UserModel.js";
import { Op } from 'sequelize';

// Fonction pour enregistrer un audit
export const logAudit = async (action, userId, details) => {
    try {
        await Audit.create({ action, userId, details, timestamp: new Date() });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'audit :", error.message);
    }
};

// Fonction pour récupérer tous les logs d'audit
export const getAuditLogs = async (req, res) => {
    try {
        const logs = await Audit.findAll({
            include: [{
                model: User,
                attributes: ['name', 'email'] // Récupérer le nom et l'email de l'utilisateur
            }],
            order: [['timestamp', 'DESC']] // Tri par timestamp décroissant
        });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ msg: "Erreur lors de la récupération des logs : " + error.message });
    }
};

// Fonction pour récupérer uniquement les logs de connexion/déconnexion
export const getLoginLogs = async (req, res) => {
    try {
        const logs = await Audit.findAll({
            where: {
                action: ['Login', 'logOut']
            },
            include: [{
                model: User,
                attributes: ['name', 'email']
            }],
            order: [['timestamp', 'DESC']]
        });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ msg: "Erreur lors de la récupération des logs de connexion/déconnexion : " + error.message });
    }
};

// Fonction pour récupérer les logs des autres activités
export const getActivityLogs = async (req, res) => {
    try {
        const logs = await Audit.findAll({
            where: {
                action: { [Op.notIn]: ['Login', 'logOut'] } // Exclure les logs de connexion/déconnexion
            },
            include: [{
                model: User,
                attributes: ['name', 'email']
            }],
            order: [['timestamp', 'DESC']]
        });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ msg: "Erreur lors de la récupération des logs d'activités : " + error.message });
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
        res.status(500).json({ msg: "Erreur lors de la suppression de l'audit : " + error.message });
    }
};
