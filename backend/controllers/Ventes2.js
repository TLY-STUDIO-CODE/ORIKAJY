import Vente2 from "../models/Vente2Model.js";
import Stock from "../models/StockModel.js";
import User from "../models/UserModel.js";
import Transaction from "../models/TransactionModel.js";
import { Op } from "sequelize";
import { logAudit } from "../controllers/Audit.js"; // Importer la fonction logAudit
import { io } from "../index.js"; // Importer l'instance io de socket.io

export const getVentes2 = async (req, res) => {
    try {
        let ventes;
        if (req.role === "admin") {
            ventes = await Vente2.findAll({
                attributes: ['uuid', 'name', 'name_client', 'description', 'qte', 'categories', 'montant', 'montant_total', 'unit', 'date_vente', 'num_factV', 'validated'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }else if (req.role === "manager") {
            ventes = await Vente2.findAll({
                attributes: ['uuid', 'name', 'name_client', 'description', 'qte', 'categories', 'montant', 'montant_total', 'unit', 'date_vente', 'num_factV', 'validated'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            ventes = await Vente2.findAll({
                attributes: ['uuid', 'name', 'name_client', 'description', 'qte', 'categories', 'montant', 'montant_total', 'unit', 'date_vente', 'num_factV', 'validated'],
                where: {
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }

        // Transformation de la valeur 'validated' en texte
        const formattedVentes = ventes.map(vente => {
            return {
                ...vente.dataValues, // Récupération des données existantes
                validated: vente.validated ? "Payée" : "Non payée" // Conversion en texte
            };
        });
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });
        req.session.userId = user.uuid;

        const uuid = user.uuid;
        const name = user.name;
         // Log the retrieval action
        await logAudit("Visualiser", user.name, `Visualisation des ventes`);
        res.status(200).json(formattedVentes, uuid, name);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const validateVente = async (req, res) => {
    try {
        const vente = await Vente2.findOne({
            where: { uuid: req.params.id }
        });
        if (!vente) return res.status(404).json({ msg: "Vente introuvable" });

        await Vente2.update({ validated: true }, {
            where: { uuid: req.params.id }
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
        await logAudit("Valider", user.name, `Validation d'un vente`);
        res.status(200).json({ msg: "Vente validée avec succès", uuid, name });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getVente2ById = async (req, res) => {
try {
        const vente2 = await Vente2.findOne({
            where: { 
                uuid: req.params.id 
            }
        });
        if (!vente2) return res.status(404).json({ msg: "Données introuvables" });
        let response;
        if(req.role === "admin"){
            response = await Vente2.findOne({
                attributes:['uuid', 'name', 'name_client', 'description', 'qte', 'categories', 'montant', 'montant_total', 'unit', 'date_vente', 'num_factV', 'validated'],
                where:{
                    id: vente2.id
            },
                include:[{
                    model: User, 
                    attributes:['name', 'email']
                }]
            });
        }else{
            response = await Vente2.findOne({
                attributes:['uuid', 'name', 'name_client', 'description', 'qte', 'categories', 'montant', 'montant_total', 'unit', 'date_vente', 'num_factV', 'validated'],
                where:{
                    [Op.and]:[{id: vente2.id}, {userId: req.userId}]
                },
                include:[{
                    model: User,
                    attributes:['name', 'email']
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
        await logAudit("Rechercher", user.name, `Recherche d'un vente`);
        res.status(200).json(response, uuid, name);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
};

// Vente multiple
export const createVente2 = async (req, res) => {
    const { items, name_client, date_vente, num_factV } = req.body; // "items" représente un tableau d'objets produits à vendre
    try {
        if (items.length < 1 || items.length > 10) {
            return res.status(400).json({ msg: "Vous devez vendre entre 1 et 10 articles." });
        }

        let totalVente2 = 0;
        for (let item of items) {
            const { name, description, categories, qte, montant, unit } = item;
            const stock = await Stock.findOne({ where: { name } });
            if (!stock) {
                return res.status(404).json({ msg: `Produit ${name} non trouvé dans le stock` });
            }
            const qteNumber = parseFloat(qte);
            let montant_total = qteNumber * montant; // Calcul par défaut

            // Ajuster le montant en fonction de l'unité
            if (unit === 'kilo') {
                montant_total = qteNumber * montant; // Le montant est supposé être par kilo
            } else if (unit === 'litre') {
                montant_total = qteNumber * montant; // Le montant est supposé être par litre
            } else if (unit === 'gramme') {
                montant_total = (qteNumber / 1000) * montant; // Le montant est supposé être par kilo
            }

            totalVente2 += montant_total;

            // Création de la vente
            await Vente2.create({
                name, description, categories, qte: qteNumber, montant, montant_total, unit, name_client, date_vente, num_factV, stockId: stock.id, userId: req.userId
            });

            // Mise à jour du stock
            if (stock.qte < qteNumber) {
                return res.status(400).json({ msg: `Stock insuffisant pour ${name}. Quantité disponible: ${stock.qte}` });
            }
            if (unit === 'kilo') {
            stock.qte -= qteNumber;  // Ensure correct addition
            await stock.save();// Assuming montant is per kilo
        } else if (unit === 'litre') {
            stock.qte -= qteNumber;  // Ensure correct addition
            await stock.save(); // Assuming montant is per litre
        } else if (unit === 'gramme') {
            stock.qte -= (qteNumber / 1000);  // Ensure correct addition
            await stock.save(); // Assuming montant is per kilo, so dividing by 1000
        } else if (unit == 'unité') {
             stock.qte -= qteNumber;  // Ensure correct addition
            await stock.save();// Assuming montant is per unite
        }
        if (stock.qte <= 20) {
            const level = stock.qte <= 10 ? 'Très faible' : 'Faible';
        io.emit('stock_notification', {
            message: `Le stock de produit ${stock.name} de catégorie ${stock.categories} est ${level} avec une quantité égale à ${stock.qte}!`,
            productName: stock.name,
            stockLevel: stock.qte,
            level: level
        });
    }

            // Création de la transaction
            await Transaction.create({
                description_transaction: `Vente de: ${name}, descripation: ${description},  nom du client: ${name_client}, unité: ${unit}`,
                qte_transaction: qteNumber,
                montant_transaction: montant,
                montant_total_transaction: montant_total,
                type_transaction: 'Credit',
                date_transaction: date_vente,
                num_factT: num_factV,
                userId: req.userId
            });
        }

        res.status(201).json({ msg: "Vente créée et stock mis à jour avec succès", totalVente2 });
           // Log the validation action
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });
        req.session.userId = user.uuid;
        const uuid = user.uuid;
         // Log the retrieval action
        await logAudit("Enregistrer", user.name, `Enregistrement de vente d'un client : ${name_client}`);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateVente2 = async (req, res) => {
    try {
        const vente2 = await Vente2.findOne({ where: { uuid: req.params.id } });
        if (!vente2) return res.status(404).json({ msg: "Données introuvables" });
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

export const deleteVente2 = async (req, res) => {
    try {
        const vente2 = await Vente2.findOne({ where: { uuid: req.params.id } });
        if (!vente2) return res.status(404).json({ msg: "Données introuvables" });
        const qteNumber = parseFloat(vente2.qte); // Convertir qte en nombre

        if(req.role === "admin"){
            await Vente2.destroy({
                where:{
                    id: vente2.id
                }
            });
            
        }else{
            if(req.userId !== vente2.userId) return res.status(403).json({msg: "Accès interdit"});
            await Vente2.destroy({
                where:{
                    [Op.and]:[{id: vente2.id}, {userId: req.userId}]
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
        const name = user.name;
         // Log the retrieval action
        await logAudit("Supprimer", user.name, `Suppression d'un vente`);
        res.status(200).json({ msg: "Vente supprimé et stock mis à jour", uuid, name });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Nouveau contrôleur pour compter les achats
export const countVentes2 = async (req, res) => {
    try {
        let vente2Count;
        if (req.role === "admin") {
            // Si l'utilisateur est admin ou manager, compter tous les achats
            vente2Count = await Vente2.count({
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else if (req.role === "manager") {
            // Si l'utilisateur est admin ou manager, compter tous les achats
            vente2Count = await Vente2.count({
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else{
            // Si l'utilisateur n'est ni admin ni manager, compter les achats de cet utilisateur uniquement
            vente2Count = await Vente2.count({
                where: {
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json({ totalVentes2: vente2Count });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
