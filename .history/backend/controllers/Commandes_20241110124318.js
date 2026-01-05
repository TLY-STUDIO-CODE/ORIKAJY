import Commande from "../models/CommandeModel.js";
import Stock from "../models/StockModel.js";
import User from "../models/UserModel.js";
import Transaction from "../models/TransactionModel.js";
import { Op } from "sequelize";
import { logAudit } from "../controllers/Audit.js"; // Importer la fonction logAudit

export const getCommande = async (req, res) => {
    try {
        let commandes;
        if (req.role === "admin") {
            commandes = await Commande.findAll({
                attributes: ['uuid', 'name', 'name_client', 'description', 'qte', 'categories', 'montantC', 'montant_totalC', 'unit', 'date_commande', 'num_factC', 'validated'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else if (req.role === "manager") {
            commandes = await Commande.findAll({
                attributes: ['uuid', 'name', 'name_client', 'description', 'qte', 'categories', 'montantC', 'montant_totalC', 'unit', 'date_commande', 'num_factC', 'validated'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            commandes = await Commande.findAll({
                attributes: ['uuid', 'name', 'name_client', 'description', 'qte', 'categories', 'montantC', 'montant_totalC', 'unit', 'date_commande', 'num_factC', 'validated'],
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
        const formattedCommandes = commandes.map(commande => {
            return {
                ...commande.dataValues, // Récupération des données existantes
                validated: commande.validated ? "Validé" : "Non validé" // Conversion en texte
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
        await logAudit("Visualiser", user.name, `Visualisation des commandes`);
        res.status(200).json(formattedCommandes, uuid, name);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const validateCommande = async (req, res) => {
    try {
        const commande = await Commande.findOne({
            where: { uuid: req.params.id }
        });
        if (!commande) return res.status(404).json({ msg: "Commande introuvable" });

        await Commande.update({ validated: true }, {
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
        await logAudit("Valider", user.name, `Validation d'un commande`);
        res.status(200).json({ msg: "Commande validée avec succès", uuid, name });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};




export const getCommandeById = async (req, res) => {
try {
        const commande = await Commande.findOne({
            where: { 
                uuid: req.params.id 
            }
        });
        if (!commande) return res.status(404).json({ msg: "Données introuvables" });
        let response;
        if(req.role === "admin"){
            response = await Commande.findOne({
                attributes:['uuid', 'name', 'name_client', 'description', 'qte', 'categories', 'montantC', 'montant_totalC', 'unit', 'date_commande', 'num_factC', 'validated'],
                where:{
                    id: commande.id
            },
                include:[{
                    model: User, 
                    attributes:['name', 'email']
                }]
            });
        }else{
            response = await Commande.findOne({
                attributes:['uuid', 'name', 'name_client', 'description', 'qte', 'categories', 'montantC', 'montant_totalC', 'unit', 'date_commande', 'num_factC', 'validated'],
                where:{
                    [Op.and]:[{id: commande.id}, {userId: req.userId}]
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
        await logAudit("Rechercher", user.name, `Recherche d'un commande`);
        res.status(200).json(response, uuid, name);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
};

// commande multiple
export const createCommande = async (req, res) => {
    const { items, name_client, date_commande, num_factC } = req.body; // "items" représente un tableau d'objets produits à vendre
    try {
        if (items.length < 1 || items.length > 10) {
            return res.status(400).json({ msg: "Vous devez vendre entre 1 et 10 articles." });
        }

        let totalCommande = 0;
        for (let item of items) {
            const { name, description, categories, qte, montantC, unit } = item;
            const stock = await Stock.findOne({ where: { name } });
            if (!stock) {
                return res.status(404).json({ msg: `Produit ${name} non trouvé dans le stock` });
            }
            const qteNumber = parseFloat(qte);
            let montant_totalC = qteNumber * montantC; // Calcul par défaut

            // Ajuster le montant en fonction de l'unité
            if (unit === 'kilo') {
                montant_totalC = qteNumber * montantC; // Le montant est supposé être par kilo
            } else if (unit === 'litre') {
                montant_totalC = qteNumber * montantC; // Le montant est supposé être par litre
            } else if (unit === 'gramme') {
                montant_totalC = (qteNumber / 1000) * montantC; // Le montant est supposé être par kilo
            }

            totalCommande += montant_totalC;

            // Création de la commande
            await Commande.create({
                name, description, categories, qte: qteNumber, montantC, montant_totalC, unit, name_client, date_commande, num_factC, stockId: stock.id, userId: req.userId
            });
            // Création de la transaction
            await Transaction.create({
                description_transaction: `commande de ${name} - ${description} - ${name_client} - ${unit}`,
                qte_transaction: qteNumber,
                montant_transaction: montantC,
                montant_total_transaction: montant_totalC,
                type_transaction: 'Commande',
                date_transaction: date_commande,
                num_factT: num_factC,
                userId: req.userId
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
        await logAudit("Enregistrer", user.name, `Enregistrement de commande d'un client : ${name_client}`);
        res.status(201).json({ msg: "Commande créée et stock mis à jour avec succès", totalCommande });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateCommande = async (req, res) => {
    try {
        const commande = await Commande.findOne({ where: { uuid: req.params.id } });
        if (!commande) return res.status(404).json({ msg: "Données introuvables" });
        const { name, description, categories, qte, montantC, name_client, date_commande, num_factC, stockId } = req.body;
        const qteNumber = parseFloat(qte);
        const montant_totalC = qteNumber * montantC; // Calcul du montant_total

        if(req.role === "admin"){
            // Update the commande entry
        await Commande.update({ name, description, categories, qte: qteNumber, montantC, montant_totalC, name_client, date_commande, num_factC, stockId },{
                where:{
                    id: commande.id
                }
            });
        }else{
            if(req.userId !== commande.userId) return res.status(403).json({msg: "Accès interdit"});
            await Commande.update({ name, description, categories, qte: qteNumber, montantC, montant_totalC, name_client, date_commande, num_factC, stockId },{
                where:{
                    [Op.and]:[{id: commande.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({ msg: "commande mise à jour et stock ajusté" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteCommande = async (req, res) => {
    try {
        const commande = await Commande.findOne({ where: { uuid: req.params.id } });
        if (!commande) return res.status(404).json({ msg: "Données introuvables" });
        const qteNumber = parseFloat(commande.qte); // Convertir qte en nombre

        if(req.role === "admin"){
            await Commande.destroy({
                where:{
                    id: commande.id
                }
            });
            
        }else{
            if(req.userId !== commande.userId) return res.status(403).json({msg: "Accès interdit"});
            await Commande.destroy({
                where:{
                    [Op.and]:[{id: commande.id}, {userId: req.userId}]
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
        await logAudit("Supprimer", user.name, `Suppression d'un commande`);
        res.status(200).json({ msg: "Commande supprimé ", uuid, name });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Nouveau contrôleur pour compter les achats
export const countCommandes = async (req, res) => {
    try {
        let commandeCount;
        if (req.role === "admin") {
            // Si l'utilisateur est admin ou manager, compter tous les achats
            commandeCount = await Commande.count({
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else if (req.role === "manager") {
            // Si l'utilisateur est admin ou manager, compter tous les achats
            commandeCount = await Commande.count({
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else{
            // Si l'utilisateur n'est ni admin ni manager, compter les achats de cet utilisateur uniquement
            commandeCount = await Commande.count({
                where: {
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json({ totalCommandes: commandeCount });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
