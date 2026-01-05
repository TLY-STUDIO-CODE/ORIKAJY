import Achat from "../models/AchatModel.js";
import { Op } from "sequelize";

// Récupérer les dépenses pour une date spécifique
export const getDepensesByDate = async (req, res) => {
    const { date } = req.params;

    try {
        const totalDepenses = await Achat.sum('montant_total', {
            where: {
                date_achat: {
                    [Op.eq]: date
                }
            }
        });

        res.status(200).json({ totalDepenses, date });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Récupérer toutes les dépenses (sans filtre par date)
export const getAllDepenses = async (req, res) => {
    try {
        const totalDepenses = await Achat.sum('montant_total');

        res.status(200).json({ totalDepenses });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Récupérer le total cumulé des dépenses
export const getTotalDepenses = async (req, res) => {
    try {
        const totalDepenses = await Achat.sum('montant_total');

        res.status(200).json({ totalDepenses });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

