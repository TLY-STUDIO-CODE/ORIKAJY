import Vente2 from "../models/Vente2Model.js";
import Achat from "../models/AchatModel.js";
import { Op } from "sequelize";

// Récupérer les revenus pour une date spécifique avec condition admin/user
export const getRevenusByDate = async (req, res) => {
    const { date } = req.params;

    try {
        let ventes, achats;

        if (req.role === "admin") {
            ventes = await Vente2.sum('montant_total', {
                where: { date_vente: { [Op.eq]: date } }
            });
            achats = await Achat.sum('montant_total', {
                where: { date_achat: { [Op.eq]: date } }
            });
        } else if (req.role === "manager") {
            ventes = await Vente2.sum('montant_total', {
                where: { date_vente: { [Op.eq]: date }}
            });
            achats = await Achat.sum('montant_total', {
                where: { date_achat: { [Op.eq]: date }}
            });
        }
        else{
            ventes = await Vente2.sum('montant_total', {
                where: { date_vente: { [Op.eq]: date }, userId: req.userId }
            });
            achats = await Achat.sum('montant_total', {
                where: { date_achat: { [Op.eq]: date }, userId: req.userId }
            });
        }

        const revenuTotal = Math.max(0, ventes - achats);
        res.status(200).json({ revenuTotal, date });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Récupérer tous les revenus avec condition admin/user
export const getAllRevenus = async (req, res) => {
    try {
        let ventes, achats;

        if (req.role === "admin") {
            ventes = await Vente2.sum('montant_total');
            achats = await Achat.sum('montant_total');
        } else if (req.role === "manager")  {
            ventes = await Vente2.sum('montant_total');
            achats = await Achat.sum('montant_total');
        }else{
            ventes = await Vente2.sum('montant_total', { where: { userId: req.userId } });
            achats = await Achat.sum('montant_total', { where: { userId: req.userId } });
        }

        const revenuTotal = Math.max(0, ventes - achats);
        res.status(200).json({ revenuTotal });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Récupérer le total des revenus avec condition admin/user
export const getTotalRevenus = async (req, res) => {
    try {
        let totalVentes, totalAchats;

        if (req.role === "admin") {
            totalVentes = await Vente2.sum('montant_total');
            totalAchats = await Achat.sum('montant_total');
        } else  if (req.role === "manager"){
            totalVentes = await Vente2.sum('montant_total');
            totalAchats = await Achat.sum('montant_total');
        }
        else{
            totalVentes = await Vente2.sum('montant_total', { where: { userId: req.userId } });
            totalAchats = await Achat.sum('montant_total', { where: { userId: req.userId } });
        }

        const revenuTotal = Math.max(0, totalVentes - totalAchats);
        res.status(200).json({ totalRevenus: revenuTotal });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Récupérer le total des ventes pour une date spécifique avec condition admin/user
export const getTotalVenteByDate = async (req, res) => {
    const { date } = req.params;

    try {
        let totalVentes;

        if (req.role === "admin") {
            totalVentes = await Vente2.sum('montant_total', {
                where: { date_vente: { [Op.eq]: date } }
            });
        } else if (req.role === "manager")  {
            totalVentes = await Vente2.sum('montant_total', {
                where: { date_vente: { [Op.eq]: date }}
            });
        }else {
            totalVentes = await Vente2.sum('montant_total', {
                where: { date_vente: { [Op.eq]: date } }
            });
        }

        res.status(200).json({ totalVentes, date });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getTotalVentes = async (req, res) => {

    try {
        let totalVentes;

        if (req.role === "admin") {
            totalVentes = await Vente2.sum('montant_total', {
            });
        } else if (req.role === "manager") {
            totalVentes = await Vente2.sum('montant_total', {
            });
        }else{
            totalVentes = await Vente2.sum('montant_total', {
                where: { userId: req.userId }
            });
        }

        res.status(200).json({ totalVentes });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};





