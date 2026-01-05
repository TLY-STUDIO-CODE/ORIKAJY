import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";
import { logAudit } from "../controllers/Audit.js"; // Importer la fonction logAudit

export const getProducts = async (req, res) =>{
    try {
        let response;
        if(req.role === "admin"){
            response = await Product.findAll({
                attributes:['uuid', 'name', 'price', 'num_factP'],
                include:[{
                    model: User, 
                    attributes:['name', 'email']
                }]
            });
        }else if (req.role === "manager"){
            response = await Product.findAll({
                attributes:['uuid', 'name', 'price', 'num_factP'],
                include:[{
                    model: User, 
                    attributes:['name', 'email']
                }]
            });
        }
        else{
            response = await Product.findAll({
                attributes:['uuid', 'name', 'price', 'num_factP'],
                where: {
                    userId: req.userId
                },
                include:[{
                    model: User,
                    attributes:['name', 'email']
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
        await logAudit("Visualiser", user.name, `Visualisation des produits`);
        res.status(200).json(response, uuid, name);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProductById = async (req, res) =>{
    try {
        const product = await Product.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!product) return res.status(404).json({msg: "Données introuvables"});
        let response;
        if(req.role === "admin"){
            response = await Product.findOne({
                attributes:['uuid', 'name', 'price', 'num_factP'],
                where:{
                    id: product.id
            },
                include:[{
                    model: User, 
                    attributes:['name', 'email']
                }]
            });
        }else{
            response = await Product.findOne({
                attributes:['uuid', 'name', 'price', 'num_factP'],
                where:{
                    [Op.and]:[{id: product.id}, {userId: req.userId}]
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

export const createProduct = async (req, res) =>{
    const {name, price, num_factP} = req.body;
    try {
        await Product.create({
            name: name,
            price: price,
            num_factP: num_factP,
            userId: req.userId
        });
        res.status(201).json({msg: "Produit créé avec succès"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateProduct = async (req, res) =>{
    try {
        const product = await Product.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!product) return res.status(404).json({msg: "Données introuvables"});
        const {name, price} = req.body;
        if(req.role === "admin"){
            await Product.update({name, price, num_factP},{
                where:{
                    id: product.id
                }
            });
        }else{
            if(req.userId !== product.userId) return res.status(403).json({msg: "Accès interdit"});
            await Product.update({name, price, num_factP},{
                where:{
                    [Op.and]:[{id: product.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Produit mis à jour avec succès"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteProduct = async (req, res) =>{
    try {
        const product = await Product.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!product) return res.status(404).json({msg: "Données introuvables"});
        if(req.role === "admin"){
            await Product.destroy({
                where:{
                    id: product.id
                }
            });
        }else{
            if(req.userId !== product.userId) return res.status(403).json({msg: "Accès interdit"});
            await Product.destroy({
                where:{
                    [Op.and]:[{id: product.id}, {userId: req.userId}]
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
        await logAudit("Supprimer", user.name, `Suppression d'un produit`);
        res.status(200).json({msg: "Produit supprimé avec succès", uuid, name});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}