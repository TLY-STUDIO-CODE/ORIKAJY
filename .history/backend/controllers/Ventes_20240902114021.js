
import Vente from "../models/VenteModel.js";
import Stock from "../models/StockModel.js";
import User from "../models/UserModel.js";

export const getVentes = async (req, res) => {
try {
        let response;
        if(req.role === "admin"){
            response = await Vente.findAll({
                attributes:['uuid', 'name', 'name_client', 'qte', 'categories', 'montant', 'date_vente'],
                include:[{
                    model: User, 
                    attributes:['name', 'email']
                }]
            });
        }else{
            response = await Vente.findAll({
                attributes:['uuid', 'name', 'name_client', 'qte', 'categories', 'montant', 'date_vente'],
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
                attributes:['uuid', 'name', 'name_client', 'qte', 'categories', 'montant', 'date_vente'],
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
                attributes:['uuid', 'name', 'name_client', 'qte', 'categories', 'montant', 'date_vente'],
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
    const { name, description, categories, qte, montant, name_client, date_vente, stockId } = req.body;
    try {
        // Create the vente entry
        const vente = await Vente.create({
            name, description, categories, qte, montant, name_client, date_vente, stockId, userId: req.userId
        });

        // Update the stock quantity
        const stock = await Stock.findOne({ where: { id: stockId } });
        if (stock) {
            stock.qte -= qte;
            await stock.save();
        }

        res.status(201).json({ msg: "Vente créée et stock mis à jour avec succès", vente });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateVente = async (req, res) => {
    try {
        const vente = await Vente.findOne({ where: { uuid: req.params.id } });
        if (!vente) return res.status(404).json({ msg: "Données introuvables" });
        const { name, description, categories, qte, montant, name_client, date_vente, stockId } = req.body;
        if(req.role === "admin"){
            // Update the vente entry
        await Vente.update({ name, description, categories, qte, montant, name_client, date_vente, stockId },{
                where:{
                    id: vente.id
                }
            });
        // Update the stock quantity
        const stock = await Stock.findOne({ where: { id: stockId } });
        if (stock) {
            stock.qte -= qte;
            await stock.save();
        }        
        }else{
            if(req.userId !== vente.userId) return res.status(403).json({msg: "Accès interdit"});
            await Vente.update({ name, description, categories, qte, montant, name_client, date_vente, stockId },{
                where:{
                    [Op.and]:[{id: vente.id}, {userId: req.userId}]
                }
            });
            // Update the stock quantity
        const stock = await Stock.findOne({ where: { id: stockId } });
        if (stock) {
            stock.qte -= qte;
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
