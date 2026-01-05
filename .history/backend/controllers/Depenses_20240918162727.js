import Achat from "../models/AchatModel.js";
import { Op } from "sequelize";

// Récupérer les dépenses pour une date spécifique avec condition admin/user
export const getDepensesByDate = async (req, res) => {
    const { date } = req.params;

    try {
        const whereCondition = req.role === "admin" 
            ? { date_achat: { [Op.eq]: date } }
            : { date_achat: { [Op.eq]: date }, userId: req.userId };

        const totalDepenses = await Achat.sum('montant_total', { where: whereCondition });

        res.status(200).json({ totalDepenses, date });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Récupérer toutes les dépenses avec condition admin/user
export const getAllDepenses = async (req, res) => {
    try {
        const whereCondition = req.role === "admin" 
            ? {}
            : { userId: req.userId };

        const totalDepenses = await Achat.sum('montant_total', { where: whereCondition });

        res.status(200).json({ totalDepenses });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Récupérer le total cumulé des dépenses avec condition admin/user
export const getTotalDepenses = async (req, res) => {
    try {
        const whereCondition = req.role === "admin" 
            ? {}
            : { userId: req.userId };

        const totalDepenses = await Achat.sum('montant_total', { where: whereCondition });

        res.status(200).json({ totalDepenses });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};



