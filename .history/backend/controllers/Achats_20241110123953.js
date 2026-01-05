import Achat from "../models/AchatModel.js";
import Stock from "../models/StockModel.js";
import User from "../models/UserModel.js";
import Transaction from "../models/TransactionModel.js";
import { Op } from "sequelize";
import { logAudit } from "../controllers/Audit.js"; // Importer la fonction logAudit
import { io } from "../index.js"; // Importer l'instance io de socket.io

export const getAchats = async (req, res) => {
    try {
        let achats;
        if (req.role === "admin") {
            achats = await Achat.findAll({
                attributes: ['uuid', 'name', 'name_four', 'description', 'qte', 'unit', 'categories', 'montant', 'montant_total', 'date_achat', 'num_factA', 'validated'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }else if (req.role === "manager") {
            achats = await Achat.findAll({
                attributes: ['uuid', 'name', 'name_four', 'description', 'qte', 'unit', 'categories', 'montant', 'montant_total', 'date_achat', 'num_factA', 'validated'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            achats = await Achat.findAll({
                attributes: ['uuid', 'name', 'name_four', 'description', 'qte', 'unit', 'categories', 'montant', 'montant_total', 'date_achat', 'num_factA', 'validated'],
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
        const formattedAchats = achats.map(achat => {
            return {
                ...achat.dataValues, // Récupération des données existantes
                validated: achat.validated ? "Payé" : "Non payé" // Conversion en texte
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
        await logAudit("Visualiser", user.name, `Visualisation des achats`);
        res.status(200).json(formattedAchats, uuid, name);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const validateAchat = async (req, res) => {
    try {
        const achat = await Achat.findOne({
            where: { uuid: req.params.id }
        });
        if (!achat) return res.status(404).json({ msg: "Achat introuvable" });

        await Achat.update({ validated: true }, {
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
        await logAudit("Valider", user.name, `Validation d'un achat`);
        res.status(200).json({ msg: "Achat validé avec succès", uuid, name });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const getAchatById = async (req, res) => {
    try {
        const achat = await Achat.findOne({
            where: { 
                uuid: req.params.id 
            }
        });
        if (!achat) return res.status(404).json({ msg: "Données introuvables" });
        let response;
        if(req.role === "admin"){
            response = await Achat.findOne({
                attributes:['uuid', 'name', 'name_four', 'description', 'qte', 'unit', 'categories', 'montant', 'montant_total', 'date_achat', 'num_factA'],
                where:{
                    id: achat.id
            },
                include:[{
                    model: User, 
                    attributes:['name', 'email']
                }]
            });
        }else{
            response = await Achat.findOne({
                attributes:['uuid', 'name', 'name_four', 'description', 'qte', 'unit', 'categories', 'montant', 'montant_total', 'date_achat', 'num_factA'],
                where:{
                    [Op.and]:[{id: achat.id}, {userId: req.userId}]
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
        await logAudit("Rechercher", user.name, `Recherche d'un achat`);
        res.status(200).json(response, uuid, name);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
};

export const createAchat = async (req, res) => {
    const { name, description, categories, qte, unit, montant, name_four, date_achat, num_factA } = req.body;
    try {
        // Convert qte to a number to ensure correct addition
        const qteNumber = parseFloat(qte);
        let montant_total = qteNumber * montant; // Calcul du montant_total
        // Adjust montant based on the unit
        if (unit === 'kilo') {
            montant_total = qteNumber * montant; // Assuming montant is per kilo
        } else if (unit === 'litre') {
            montant_total = qteNumber * montant; // Assuming montant is per litre
        } else if (unit === 'gramme') {
            montant_total = (qteNumber / 1000) * montant; // Assuming montant is per kilo, so dividing by 1000
        } else if (unit == 'unité') {
            montant_total = qteNumber * montant; // Assuming montant is per unite
        }

        const stock = await Stock.findOne({ where: { name: name } });
        if (!stock) {
            return res.status(404).json({ msg: "Produit non trouvé dans le stock" });
        }

        // Create the achat entry
        const achat = await Achat.create({
            name, description, categories, qte: qteNumber, unit, montant, montant_total, name_four, date_achat,num_factA, stockId:stock.id, userId: req.userId
        });

        // Update the stock quantity
        if (unit === 'kilo') {
            stock.qte += qteNumber;  // Ensure correct addition
            await stock.save();// Assuming montant is per kilo
        } else if (unit === 'litre') {
            stock.qte += qteNumber;  // Ensure correct addition
            await stock.save(); // Assuming montant is per litre
        } else if (unit === 'gramme') {
            stock.qte += (qteNumber / 1000);  // Ensure correct addition
            await stock.save(); // Assuming montant is per kilo, so dividing by 1000
        } else if (unit == 'unité') {
             stock.qte += qteNumber;  // Ensure correct addition
            await stock.save();// Assuming montant is per unite
        }
        if (stock.qte > 20) {
            const level = stock.qte > 10 ? 'Suffisant' : 'Assez suffisant';
        io.emit('stock_notification', {
            message: `Le stock de produit ${stock.name} de catégorie ${stock.categories} est augmenté de niveau avec une quantité de ${stock.qte}!`,
            productName: stock.name,
            stockLevel: stock.qte,
            level: level
        });
    }

        await Transaction.create({
            description_transaction: `Achat de: ${name}, description: ${description}, nom du fournisseur: ${name_four}`,
            qte_transaction: qteNumber,
            montant_transaction: montant,
            montant_total_transaction: montant_total,
            type_transaction: 'Debit',
            date_transaction: date_achat,
            num_factT: num_factA,
            userId: req.userId
        });
        res.status(201).json({ msg: "Achat créé et stock mis à jour avec succès et transaction", achat });

           // Log the validation action
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });
        req.session.userId = user.uuid;
        const uuid = user.uuid;
         // Log the retrieval action
        await logAudit("Enregistrer", user.name, `Enregistrement d'achat chez un fournisseur : ${name_four}`);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateAchat = async (req, res) => {
    try {
        const achat = await Achat.findOne({ where: { uuid: req.params.id } });
        if (!achat) return res.status(404).json({ msg: "Données introuvables" });

        const { name, description, categories, qte, montant, name_four, date_achat, num_factA, stockId } = req.body;
        const qteNumber = parseFloat(qte); // Convertir qte en nombre
        const montant_total = qteNumber * montant; // Calcul du montant_total

        if (req.role === "admin") {
            
            await Achat.update(
                { name, description, categories, qte: qteNumber, montant, montant_total, name_four, date_achat, num_factA, stockId },
                { where: { id: achat.id } }
            );

            // Mettre à jour la quantité en stock
            const stock = await Stock.findOne({ where: { id: stockId } });
            if (stock) {
                stock.qte += qteNumber;
                await stock.save();
            }
        } else {
            if (req.userId !== achat.userId) return res.status(403).json({ msg: "Accès interdit" });
            await Achat.update(
                { name, description, categories, qte: qteNumber, montant, montant_total, name_four, date_achat, num_factA, stockId },
                {
                    where: {
                        [Op.and]: [{ id: achat.id }, { userId: req.userId }]
                    }
                }
            );

            // Mettre à jour la quantité en stock
            const stock = await Stock.findOne({ where: { id: stockId } });
            if (stock) {
                stock.qte += qteNumber;
                await stock.save();
            }
        }

        res.status(200).json({ msg: "Achat mis à jour et stock ajusté" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
export const deleteAchat = async (req, res) => {
    try {
        const achat = await Achat.findOne({ where: { uuid: req.params.id } });
        if (!achat) return res.status(404).json({ msg: "Données introuvables" });
        const qteNumber = parseFloat(achat.qte); // Convertir qte en nombre
        if (req.role === "admin") {
            await Achat.destroy({
                where: { id: achat.id }
            });

            
        } else {
            if (req.userId !== achat.userId) return res.status(403).json({ msg: "Accès interdit" });
            await Achat.destroy({
                where: {
                    [Op.and]: [{ id: achat.id }, { userId: req.userId }]
                }
            });

            // Mettre à jour la quantité en stock
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
        await logAudit("Supprimer", user.name, `Suppression d'un achat`);

        res.status(200).json({ msg: "Achat supprimé et stock mis à jour", uuid, name });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Nouveau contrôleur pour compter les achats
// Nouveau contrôleur pour compter les achats
export const countAchats = async (req, res) => {
    try {
        // Vérifier si l'utilisateur est un admin ou manager
        let achatCount;
        if (req.role === "admin") {
            // Si l'utilisateur est admin ou manager, compter tous les achats
            achatCount = await Achat.count({
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else if (req.role === "manager") {
            // Si l'utilisateur est admin ou manager, compter tous les achats
            achatCount = await Achat.count({
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else{
            // Si l'utilisateur n'est ni admin ni manager, compter les achats de cet utilisateur uniquement
            achatCount = await Achat.count({
                where: {
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }

        res.status(200).json({ totalAchats: achatCount });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


