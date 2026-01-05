
import Vente from "../models/VenteModel.js";
import Stock from "../models/StockModel.js";
import User from "../models/UserModel.js";
import Transaction from "../models/TransactionModel.js";
import { Op } from "sequelize";


export const getVentes = async (req, res) => {
try {
        let response;
        if(req.role === "admin"){
            response = await Vente.findAll({
                attributes:['uuid', 'name', 'name_client', 'description', 'qte', 'categories', 'montant', 'montant_total', 'date_vente', 'num_factV'],
                include:[{
                    model: User, 
                    attributes:['name', 'email']
                }]
            });
        }else{
            response = await Vente.findAll({
                attributes:['uuid', 'name', 'name_client', 'description', 'qte', 'categories', 'montant', 'montant_total', 'date_vente', 'num_factV'],
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
};



export const getVenteById = async (req, res) => {
try {
        const vente = await Vente.findOne({
            where: { 
                uuid: req.params.id 
            }
        });
        if (!vente) return res.status(404).json({ msg: "Données introuvables" });
        let response;
        if(req.role === "admin"){
            response = await Vente.findOne({
                attributes:['uuid', 'name', 'name_client', 'description', 'qte', 'categories', 'montant', 'montant_total', 'date_vente', 'num_factV'],
                where:{
                    id: vente.id
            },
                include:[{
                    model: User, 
                    attributes:['name', 'email']
                }]
            });
        }else{
            response = await Vente.findOne({
                attributes:['uuid', 'name', 'name_client', 'description', 'qte', 'categories', 'montant', 'montant_total', 'date_vente', 'num_factV'],
                where:{
                    [Op.and]:[{id: vente.id}, {userId: req.userId}]
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
};

export const createVente = async (req, res) => {
    const { name, description, categories, qte, montant, name_client, date_vente, num_factV, stockId } = req.body;
    try {
        const qteNumber = parseFloat(qte);
        const montant_total = qteNumber * montant; // Calcul du montant_total

        // Create the vente entry
        const vente = await Vente.create({
            name, description, categories, qte: qteNumber, montant, montant_total, name_client, date_vente, num_factV, stockId, userId: req.userId
        });

        // Update the stock quantity
        const stock = await Stock.findOne({ where: { id: stockId } });
        if (stock) {
            stock.qte -= qteNumber;
            await stock.save();
        }
        await Transaction.create({
            description_transaction: `Vente de ${name} - ${description}`,
            qte_transaction: qteNumber,
            montant_transaction: montant,
            montant_total_transaction: montant_total,
            type_transaction: 'Credit',
            date_transaction: date_vente,
            userId: req.userId
        });

        res.status(201).json({ msg: "Vente créée et stock mis à jour avec succès", vente });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateVente = async (req, res) => {
    try {
        const vente = await Vente.findOne({ where: { uuid: req.params.id } });
        if (!vente) return res.status(404).json({ msg: "Données introuvables" });
        const { name, description, categories, qte, montant, name_client, date_vente, num_factV, stockId } = req.body;
        const qteNumber = parseFloat(qte);
        const montant_total = qteNumber * montant; // Calcul du montant_total

        if(req.role === "admin"){
         // Update the stock quantity
        const stock = await Stock.findOne({ where: { id: stockId } });
        if (stock) {
            stock.qte += qteNumber;
            await stock.save();
        }  
            // Update the vente entry
        await Vente.update({ name, description, categories, qte: qteNumber, montant, montant_total, name_client, date_vente, num_factV, stockId },{
                where:{
                    id: vente.id
                }
            });
         // Mettre à jour la quantité en stock après la modification
        if (stock) {
            stock.qte -= qteNumber; // Appliquer la nouvelle quantité
            await stock.save();
        }

        }else{
            if(req.userId !== vente.userId) return res.status(403).json({msg: "Accès interdit"});
            if (stock) {
            stock.qte += qteNumber;
            await stock.save();
        }  
            await Vente.update({ name, description, categories, qte: qteNumber, montant, montant_total, name_client, date_vente, num_factV, stockId },{
                where:{
                    [Op.and]:[{id: vente.id}, {userId: req.userId}]
                }
            });
            // Update the stock quantity
        const stock = await Stock.findOne({ where: { id: stockId } });
        if (stock) {
            stock.qte -= qteNumber;
            await stock.save();
        }    
        
        }
        res.status(200).json({ msg: "Vente mise à jour et stock ajusté" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteVente = async (req, res) => {
    try {
        const vente= await Vente.findOne({ where: { uuid: req.params.id } });
        if (!vente) return res.status(404).json({ msg: "Données introuvables" });
        if(req.role === "admin"){
            await Vente.destroy({
                where:{
                    id: vente.id
                }
            });
            
        // Update the stock quantity
        const stock = await Stock.findOne({ where: { id: vente.stockId } });
        if (stock) {
            stock.qte += vente.qte;
            await stock.save();
        }
        await Transaction.destroy({ where: { id: transaction.id } });
        }else{
            if(req.userId !== vente.userId) return res.status(403).json({msg: "Accès interdit"});
            await Vente.destroy({
                where:{
                    [Op.and]:[{id: vente.id}, {userId: req.userId}]
                }
            });
        // Update the stock quantity
        const stock = await Stock.findOne({ where: { id: vente.stockId } });
        if (stock) {
            stock.qte += vente.qte;
            await stock.save();
        }
        }
        res.status(200).json({ msg: "Vente supprimé et stock mis à jour" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
