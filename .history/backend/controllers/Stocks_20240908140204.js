import Stock from "../models/StockModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getStocks = async (req, res) =>{
    try {
        let response;
        if(req.role === "admin"){
            response = await Stock.findAll({
                attributes:['uuid', 'name', 'name_four', 'qte', 'categories', 'date_stock', 'num_fact'],
                include:[{
                    model: User, 
                    attributes:['name', 'email']
                }]
            });
        }else{
            response = await Stock.findAll({
                attributes:['uuid', 'name', 'name_four', 'qte', 'categories', 'date_stock', 'num_fact'],
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
                attributes:['uuid', 'name', 'name_four', 'qte', 'categories', 'date_stock', 'num_fact'],
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
                attributes:['uuid', 'name', 'name_four', 'qte', 'categories', 'date_stock', 'num_fact'],
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
    const {name, name_four, qte, categories, date_stock, num_fact} = req.body;
    try {
        await Stock.create({
            name: name,
            name_four: name_four,
            qte: qte,
            categories: categories,
            date_stock: date_stock,
            num_fact: num_fact,
            userId: req.userId
        });
        await Transaction.create({
            description_transaction: `Stock de ${name} - ${name_four}`,
            qte_transaction: qteNumber,
            type_transaction: 'Stock',
            date_transaction: date_stock,
            num_factT: num_fact,
            userId: req.userId
        });
        await Product.create({
            name: `${name}`,
            price: montant,
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
        const {name, name_four, qte, categories, date_stock, num_fact} = req.body;
        if(req.role === "admin"){
            await Stock.update({name, name_four, qte, categories, date_stock, num_fact},{
                where:{
                    id: stock.id
                }
            });
            await Transaction.create({
                description_transaction: `Stock de ${name} - ${name_four} - ${categories}`,
                qte_transaction: qteNumber,
                type_transaction: 'Stock',
                date_transaction: date_stock,
                num_factT: num_fact,
                userId: req.userId
        });
        await Product.update({
            name: `${name}`,
            price: montant,
        },{
                where:{
                    id: product.id
                }
            });
        }else{
            if(req.userId !== stock.userId) return res.status(403).json({msg: "Accès interdit"});
            await Stock.update({name, name_four, qte, categories, date_stock, num_fact},{
                where:{
                    [Op.and]:[{id: stock.id}, {userId: req.userId}]
                }
            });
            await Transaction.create({
            description_transaction: `Stock de ${name} - ${name_four} - ${categories}`,
            qte_transaction: qteNumber,
            type_transaction: 'Stock',
            date_transaction: date_stock,
            num_factT: num_fact,
            userId: req.userId
        });
        await Product.update({
            name: `${name}`,
            price: montant,
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
        const {name, name_four, qte, categories, date_stock, num_fact} = req.body;
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