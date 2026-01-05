import Stock from "../models/StockModel.js";
import User from "../models/UserModel.js";
import Transaction from "../models/TransactionModel.js";
import Product from "../models/ProductModel.js";
import { Op } from "sequelize";
import { logAudit } from "../controllers/Audit.js"; // Importer la fonction logAudit
import { io } from "../index.js"; // Importer l'instance io de socket.io

export const getStocks = async (req, res) => {
    try {
        let response;
        if (req.role === "admin") {
            response = await Stock.findAll({
                attributes: ['uuid', 'name', 'qte', 'unit', 'montantS', 'montant_totalS', 'categories', 'date_stock', 'num_fact'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else if(req.role === "manager") {
            response = await Stock.findAll({
                attributes: ['uuid', 'name', 'qte', 'unit', 'montantS', 'montant_totalS', 'categories', 'date_stock', 'num_fact'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Stock.findAll({
                attributes: ['uuid', 'name', 'qte', 'unit', 'montantS', 'montant_totalS', 'categories', 'date_stock', 'num_fact'],
                where: {
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });
        req.session.userId = user.uuid;

        const uuid = user.uuid;
        const name = user.name;
         // Log the retrieval action
        await logAudit("Visualiser", user.name, `Visualisation des stocks`);
        res.status(200).json(response, uuid, name);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getStockById = async (req, res) => {
    try {
        const stock = await Stock.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!stock) return res.status(404).json({ msg: "Données introuvables" });

        let response;
        if (req.role === "admin") {
            response = await Stock.findOne({
                attributes: ['uuid', 'name', 'qte', 'unit', 'categories', 'montantS', 'montant_totalS', 'date_stock', 'num_fact'],
                where: {
                    id: stock.id
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Stock.findOne({
                attributes: ['uuid', 'name', 'qte', 'unit', 'categories', 'montantS', 'montant_totalS', 'date_stock', 'num_fact'],
                where: {
                    [Op.and]: [{ id: stock.id }, { userId: req.userId }]
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
         // Log the validation action
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });
        req.session.userId = user.uuid;

        const uuid = user.uuid;
        const name = user.name;
         // Log the retrieval action
        await logAudit("Rechercher", user.name, `Recherche d'un produit dans le stock`);
        res.status(200).json(response, uuid, name);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createStock = async (req, res) => {
    const { name, qte, unit, categories, montantS, date_stock, num_fact } = req.body;
    try {
        const qteNumber = parseFloat(qte);
        if (isNaN(qteNumber)) {
            return res.status(400).json({ msg: "Quantité invalide" });
        }

        let montant_totalS = qteNumber * montantS;

        switch (unit) {
            case 'kilo':
            case 'litre':
            case 'unité':
                montant_totalS = qteNumber * montantS;
                break;
            case 'gramme':
                montant_totalS = (qteNumber / 1000) * montantS;
                break;
        }

        await Stock.create({
            name,
            qte: qteNumber,
            unit,
            categories,
            montantS,
            montant_totalS,
            date_stock,
            num_fact,
            userId: req.userId
        });

        // Émettre une notification en fonction du niveau de stock
        

        await Transaction.create({
            description_transaction: `Stock de ${name}`,
            qte_transaction: qteNumber, // La soustraction avec unit est incorrecte
            montant_transaction: montantS,
            montant_total_transaction: montant_totalS,
            type_transaction: 'Stock',
            date_transaction: date_stock,
            num_factT: num_fact,
            userId: req.userId
        });

        await Product.create({
            name,
            price: montantS,
            num_factP: num_fact,
            userId: req.userId
        });
           // Log the validation action
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });
        req.session.userId = user.uuid;
        const uuid = user.uuid;
         // Log the retrieval action
        await logAudit("Enregistrer", user.name, `Enregistrement d'un stock avec nom de produit : ${name}`);

        if (qteNumber <= 20) {
            const level = qteNumber <= 10 ? 'Très faible' : 'Faible';
            io.emit('stock_notification', {
                message: `Stock de ${name} de catégorie ${categories} est ${level} avec une quantité égale à ${qteNumber}`,
                stock: qteNumber,
                level: level
            });
        }
        res.status(201).json({ msg: "Stock créé avec succès" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateStock = async (req, res) => {
    try {
        const stock = await Stock.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!stock) return res.status(404).json({ msg: "Données introuvables" });

        const { name, qte, unit, categories, montantS, date_stock, num_fact } = req.body;
        const qteNumber = parseFloat(qte);
        if (isNaN(qteNumber)) {
            return res.status(400).json({ msg: "Quantité invalide" });
        }

        let montant_totalS = qteNumber * montantS;
        switch (unit) {
            case 'kilo':
            case 'litre':
            case 'unité':
                montant_totalS = qteNumber * montantS;
                break;
            case 'gramme':
                montant_totalS = (qteNumber / 1000) * montantS;
                break;
        }

        await Stock.update({
            name,
            qte: qteNumber,
            unit,
            categories,
            montantS,
            montant_totalS,
            date_stock,
            num_fact,
        }, {
            where: {
                id: stock.id
            }
        });

        await Transaction.create({
            description_transaction: `Mise à jour du stock de ${name}`,
            qte_transaction: qteNumber,
            montant_transaction: montantS,
            montant_total_transaction: montant_totalS,
            type_transaction: 'Stock',
            date_transaction: date_stock,
            num_factT: num_fact,
            userId: req.userId
        });

        const product = await Product.findOne({ where: { num_factP: num_fact } });
        if (product) {
            await Product.update({
                name,
                price: montantS,
                num_factP: num_fact,
            }, {
                where: {
                    id: product.id
                }
            });
        }
        
         // Log the validation action
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });
        req.session.userId = user.uuid;
        const uuid = user.uuid;
         // Log the retrieval action
        await logAudit("Mettre à jour", user.name, `Mise à jour d'un stock avec nom de produit : ${name}`);

        // Envoi de notification si le stock est faible
           if (qteNumber <= 20) {
    const level = qteNumber <= 10 ? 'Très faible' : 'Faible';
    io.emit('stock_notification', {
        message: `Stock de ${name} de catégorie ${categories} est ${level} avec une quantité égale à ${qteNumber}`,
        stockLevel: qteNumber,
        productName: name, // Ajouter un identifiant pour gérer les notifications
        level: level
    });
} else {
    // Si le stock est supérieur à 20, émettre un événement de suppression de notification
    io.emit('stock_notification', {
        message: `Stock de ${name} est maintenant à ${qteNumber}, supérieur à 20.`,
        stockLevel: qteNumber,
        productName: name
    });
}
        res.status(200).json({ msg: "Stock mis à jour avec succès" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteStock = async (req, res) => {
    try {
        const stock = await Stock.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!stock) return res.status(404).json({ msg: "Données introuvables" });

        if (req.role === "admin" || req.userId === stock.userId) {
            await Stock.destroy({
                where: {
                    id: stock.id
                }
            });
             // Log the validation action
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });
        req.session.userId = user.uuid;

        const uuid = user.uuid;
        const name = user.name;
         // Log the retrieval action
        await logAudit("Supprimer", user.name, `Suppression d'un stock`);
            res.status(200).json({ msg: "Stock supprimé avec succès", uuid, name});
        } else {
            res.status(403).json({ msg: "Accès interdit" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

