import Stock from "../models/StockModel.js";
import User from "../models/UserModel.js";
import Transaction from "../models/TransactionModel.js";
import Product from "../models/ProductModel.js";
import { Op } from "sequelize";

export const getStocks = async (req, res) =>{
    try {
        let response;
        if(req.role === "admin"){
            response = await Stock.findAll({
                attributes:['uuid', 'name', 'qte', 'unit', 'montantS', 'montant_totalS',  'categories', 'date_stock', 'num_fact'],
                include:[{
                    model: User, 
                    attributes:['name', 'email']
                }]
            });
        }else{
            response = await Stock.findAll({
                attributes:['uuid', 'name', 'qte', 'unit', 'montantS', 'montant_totalS',  'categories', 'date_stock', 'num_fact'],
                where:{
                    userId: req.userId
                },
                include:[{
                    model: User,
                    attributes:['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getStockById = async (req, res) =>{
    try {
        const stock = await Stock.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!stock) return res.status(404).json({msg: "Données introuvables"});
        let response;
        if(req.role === "admin"){
            response = await Stock.findOne({
                attributes:['uuid', 'name',  'qte', 'unit', 'categories', 'montantS', 'montant_totalS', 'date_stock', 'num_fact'],
                where:{
                    id: stock.id
            },
                include:[{
                    model: User, 
                    attributes:['name', 'email']
                }]
            });
        }else{
            response = await Stock.findOne({
                attributes:['uuid', 'name', 'qte', 'unit', 'categories', 'montantS', 'montant_totalS', 'date_stock', 'num_fact'],
                where:{
                    [Op.and]:[{id: stock.id}, {userId: req.userId}]
                },
                include:[{
                    model: User,
                    attributes:['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createStock = async (req, res) =>{
    const {name, qte, unit, categories, montantS, date_stock, num_fact} = req.body;
    try {
        const qteNumber = parseFloat(qte); // Convertir qte en nombre
        const montant_totalS = qteNumber * montantS; // Calcul du montant_total
        // Adjust montant based on the unit
        if (unit === 'kilo') {
            montant_total = qteNumber * montantS; // Assuming montant is per kilo
        } else if (unit === 'litre') {
            montant_total = qteNumber * montantS; // Assuming montant is per litre
        } else if (unit === 'gramme') {
            montant_total = (qteNumber / 1000) * montantS; // Assuming montant is per kilo, so dividing by 1000
        } else if (unit == 'unité') {
            montant_total = qteNumber * montantS; // Assuming montant is per unite
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
        await Transaction.create({
            description_transaction: `Stock de ${name}`,
            qte_transaction: qteNumber - '${unit}',
            montant_transaction: montantS,
            montant_total_transaction: montant_totalS,
            type_transaction: 'Stock',
            date_transaction: date_stock,
            num_factT: num_fact,
            userId: req.userId
        });
        await Product.create({
            name: `${name}`,
            price: montantS,
            num_factP: num_fact,
            userId: req.userId
        });
        res.status(201).json({msg: "Stock créé avec succès"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateStock = async (req, res) =>{
    try {
        const stock = await Stock.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!stock) return res.status(404).json({msg: "Données introuvables"});
        const {name, qte, categories, montantS, date_stock, num_fact} = req.body;
        const qteNumber = parseFloat(qte); // Convertir qte en nombre
        const montant_totalS = qte * montantS; // Calcul du montant_total
        // Adjust montant based on the unit
        if (unit === 'kilo') {
            montant_total = qteNumber * montantS; // Assuming montant is per kilo
        } else if (unit === 'litre') {
            montant_total = qteNumber * montantS; // Assuming montant is per litre
        } else if (unit === 'gramme') {
            montant_total = (qteNumber / 1000) * montantS; // Assuming montant is per kilo, so dividing by 1000
        } else if (unit == 'unité') {
            montant_total = qteNumber * montantS; // Assuming montant is per unite
        }
        if(req.role === "admin"){
            await Stock.update({
            name,
            qte: qteNumber,
            unit,
            categories,
            montantS,
            montant_totalS,
            date_stock,
            num_fact,
            },{
                where:{
                    id: stock.id
                }
            });
            await Transaction.create({
                description_transaction: `Stock de ${name}`,
                qte_transaction: qteNumber - '${unit}',
                montant_transaction: montantS,
                montant_total_transaction: montant_totalS,
                type_transaction: 'Stock',
                date_transaction: date_stock,
                num_factT: num_fact,
                userId: req.userId
        });
        const product = await Product.findOne({ where: { price: montantS } });
        if (!product) {
            return res.status(404).json({ msg: "Produit non trouvé dans le produit" });
        }
        await Product.update({
            name: `${name}`,
            price: montantS,
            num_factP: num_fact,
            productID: product.id
            
        },{
                where:{
                    id: product.id
                }
            }); 
        }else{
            if(req.userId !== stock.userId) return res.status(403).json({msg: "Accès interdit"});
            await Stock.update({
            name,
            qte: qteNumber,
            unit,
            categories,
            montantS,
            montant_totalS,
            date_stock,
            num_fact,},{
                where:{
                    [Op.and]:[{id: stock.id}, {userId: req.userId}]
                }
            });
            await Transaction.create({
            description_transaction: `Stock de ${name}`,
            qte_transaction: qteNumber - '${unit}',
            montant_transaction: montantS,
            montant_total_transaction: montant_totalS,
            type_transaction: 'Stock',
            date_transaction: date_stock,
            num_factT: num_fact,
            userId: req.userId
        });
        const product = await Product.findOne({ where: { num_factP: num_fact } });
        if (!product) {
            return res.status(404).json({ msg: "Produit non trouvé dans le produit" });
        }
        await Product.update({
            name: `${name}`,
            price: montantS,
            num_factP: num_fact,
            productID: product.id
            
        },{
                where:{
                    [Op.and]:[{id: product.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Stock mis à jour avec succès"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteStock = async (req, res) =>{
    try {
        const stock = await Stock.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!stock) return res.status(404).json({msg: "Données introuvables"});
        const {name, qte, unit, categories, date_stock, num_fact} = req.body;
        if(req.role === "admin"){
            await Stock.destroy({
                where:{
                    id: stock.id
                }
            });
        }else{
            if(req.userId !== stock.userId) return res.status(403).json({msg: "Accès interdit"});
            await Stock.destroy({
                where:{
                    [Op.and]:[{id: stock.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Stock supprimé avec succès"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// Notification for low stock levels
export const notifyLowStock = async (req, res) => {
    try {
        const lowStockItems = await Stock.findAll({
            where: {
                qte: { [Op.lte]: 10 }
            }
        });

        const veryLowStockItems = lowStockItems.filter(item => item.qte < 10);
        const lowStockItemsEqualTen = lowStockItems.filter(item => item.qte === 10);

        if (veryLowStockItems.length > 0 || lowStockItemsEqualTen.length > 0) {
            res.status(200).json({
                msg: "Stock warnings",
                lowStockItems: lowStockItemsEqualTen,
                veryLowStockItems: veryLowStockItems
            });
        } else {
            res.status(200).json({
                msg: "Stock levels are sufficient"
            });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}