import Transaction from "../models/TransactionModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getTransactions = async (req, res) => {
    try {
        let response;
        if (req.role === "admin" && "manager") {
            response = await Transaction.findAll({
                attributes: ['uuid', 'description_transaction', 'montant_transaction', 'type_transaction', 'montant_total_transaction', 'qte_transaction', 'num_factT', 'date_transaction', 'userId'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Transaction.findAll({
                attributes: ['uuid', 'description_transaction', 'montant_transaction', 'type_transaction', 'montant_total_transaction', 'qte_transaction', 'num_factT', 'date_transaction', 'userId'],
                where: {
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!transaction) return res.status(404).json({ msg: "Données introuvables" });
        let response;
        if (req.role === "admin") {
            response = await Transaction.findOne({
                attributes: ['uuid', 'description_transaction', 'montant_transaction', 'type_transaction', 'montant_total_transaction', 'qte_transaction', 'num_factT', 'date_transaction', 'userId'],
                where: { id: transaction.id },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Transaction.findOne({
                attributes: ['uuid', 'description_transaction', 'montant_transaction', 'type_transaction', 'montant_total_transaction', 'qte_transaction', 'num_factT', 'date_transaction', 'userId'],
                where: {
                    [Op.and]: [{ id: transaction.id }, { userId: req.userId }]
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}



export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            where: { uuid: req.params.id }
        });
        if (!transaction) return res.status(404).json({ msg: "Données introuvables" });
        if (req.role === "admin") {
            await Transaction.destroy({ where: { id: transaction.id } });
        } else {
            if (req.userId !== transaction.userId) return res.status(403).json({ msg: "Accès interdit" });
            await Transaction.destroy({
                where: {
                    [Op.and]: [{ id: transaction.id }, { userId: req.userId }]
                }
            });
        }
        res.status(200).json({ msg: "Transaction supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


