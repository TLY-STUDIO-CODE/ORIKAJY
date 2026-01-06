import Vente2 from "../models/Vente2Model.js";
import Achat from "../models/AchatModel.js";
import { Op } from "sequelize";

// Récupérer les pertes pour une date spécifique avec condition admin/user
export const getPertesByDate = async (req, res) => {
    const { date } = req.params;

    try {
        let totalVentes, totalAchats;

        if (req.role === "admin") {
            totalVentes = await Vente2.sum('montant_total', {
                where: { date_vente: { [Op.eq]: date } }
            });
            totalAchats = await Achat.sum('montant_total', {
                where: { date_achat: { [Op.eq]: date } }
            });
        } else if (req.role === "manager") {
            totalVentes = await Vente2.sum('montant_total', {
                where: { date_vente: { [Op.eq]: date } }
            });
            totalAchats = await Achat.sum('montant_total', {
                where: { date_achat: { [Op.eq]: date } }
            });
        }
        else{
            totalVentes = await Vente2.sum('montant_total', {
                where: { date_vente: { [Op.eq]: date }, userId: req.userId }
            });
            totalAchats = await Achat.sum('montant_total', {
                where: { date_achat: { [Op.eq]: date }, userId: req.userId }
            });
        }

        const pertes = Math.max(0, totalAchats - totalVentes);
        res.status(200).json({ pertes, date });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Récupérer toutes les pertes avec condition admin/user
export const getAllPertes = async (req, res) => {
    try {
        let totalVentes, totalAchats;

        if (req.role === "admin") {
            totalVentes = await Vente2.sum('montant_total');
            totalAchats = await Achat.sum('montant_total');
        } else if (req.role === "manager") {
            totalVentes = await Vente2.sum('montant_total');
            totalAchats = await Achat.sum('montant_total');
        }else{
            totalVentes = await Vente2.sum('montant_total', { where: { userId: req.userId } });
            totalAchats = await Achat.sum('montant_total', { where: { userId: req.userId } });
        }

        const pertes = Math.max(0, totalAchats - totalVentes); 
        res.status(200).json({ pertes });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Récupérer le total des pertes avec condition admin/user
export const getTotalPertes = async (req, res) => {
    try {
        let totalVentes, totalAchats;

        if (req.role === "admin") {
            totalVentes = await Vente2.sum('montant_total');
            totalAchats = await Achat.sum('montant_total');
        } else  if (req.role === "manager")  {
            totalVentes = await Vente2.sum('montant_total');
            totalAchats = await Achat.sum('montant_total');
        }else{
            totalVentes = await Vente2.sum('montant_total', { where: { userId: req.userId } });
            totalAchats = await Achat.sum('montant_total', { where: { userId: req.userId } });
        }

        const pertes = Math.max(0, totalAchats - totalVentes);
        res.status(200).json({ pertes });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
