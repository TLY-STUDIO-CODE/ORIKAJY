import User from "../models/UserModel.js";
import argon2 from "argon2";
import path from "path";
import fs from "fs";
import { logAudit } from "../controllers/Audit.js"; // Importer la fonction logAudit

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['uuid', 'name', 'email', 'role', 'image', 'status']
        });
        // Ajout du champ "status" pour chaque utilisateur
        const usersWithStatus = response.map(user => ({
            ...user.toJSON(),  // Convertir l'utilisateur en objet JSON
            status: req.session.userId === user.uuid ? "connecté" : "déconnecté" // Vérifier si l'utilisateur est connecté
        }));

        res.status(200).json(usersWithStatus);
        await logAudit(
            "Récupération des utilisateurs", 
            req.session.name || "invité", 
            `Tous les utilisateurs ont été récupérés.`
        );
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            attributes: ['uuid', 'name', 'email', 'role', 'image', 'status'],
            where: {
                uuid: req.params.id
            }
        });
        // Ajouter le statut de l'utilisateur récupéré
        const userWithStatus = {
            ...response.toJSON(),
            status: req.session.userId === response.uuid ? "connecté" : "déconnecté"
        };

        res.status(200).json(userWithStatus);
       // Enregistrer l'action dans les logs d'audit
        await logAudit(
            "Récupération d'utilisateur par ID", 
            req.session.userId || "invité", 
            `Utilisateur avec ID ${req.params.id} récupéré.`
        );
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createUser = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Le mot de passe et la confirmation du mot de passe ne correspondent pas" });

    const hashPassword = await argon2.hash(password);

    let image = null;
    if (req.files && req.files.image) {
        const file = req.files.image;
        const fileName = Date.now() + path.extname(file.name);
        const uploadPath = path.join('public/upload', fileName);

        image = `/upload/${fileName}`;

        file.mv(uploadPath, (err) => {
            if (err) return res.status(500).json({ msg: "Erreur lors du téléchargement de l'image" });
        });
    }

    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role,
            image: image
        });
        res.status(201).json({ msg: "Inscription réussie" });
        // Enregistrer l'action dans les logs d'audit
        await logAudit(
            "Création d'un utilisateur", 
            req.session.userId || "invité", 
            `Nouvel utilisateur créé avec l'email ${email}.`
        );
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const updateUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) return res.status(404).json({ msg: "Utilisateur introuvable" });

    const { name, email, password, confPassword, role } = req.body;

    let hashPassword;
    if (password === "" || password === null) {
        hashPassword = user.password;
    } else {
        hashPassword = await argon2.hash(password);
    }
    if (password !== confPassword) return res.status(400).json({ msg: "Le mot de passe et la confirmation du mot de passe ne correspondent pas" });

    let image = user.image;
    if (req.files && req.files.image) {
        // Supprimer l'ancienne image
        if (image) {
            const oldImagePath = path.join('public', image);
            fs.unlinkSync(oldImagePath);
        }

        const file = req.files.image;
        const fileName = Date.now() + path.extname(file.name);
        const uploadPath = path.join('public/upload', fileName);

        image = `/upload/${fileName}`;

        file.mv(uploadPath, (err) => {
            if (err) return res.status(500).json({ msg: "Erreur lors du téléchargement de l'image" });
        });
    }

    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role,
            image: image
        }, {
            where: {
                id: user.id
            }
        });
        res.status(200).json({ msg: "L'utilisateur a été mis à jour avec succès" });
        // Enregistrer l'action dans les logs d'audit
        await logAudit(
            "Mise à jour d'utilisateur", 
            req.session.userId || "invité", 
            `Utilisateur avec ID ${req.params.id} mis à jour.`
        );
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) return res.status(404).json({ msg: "Utilisateur introuvable" });

    if (user.image) {
        const imagePath = path.join('public', user.image);
        fs.unlinkSync(imagePath);
    }

    try {
        await User.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({ msg: "L'utilisateur a été supprimé avec succès" });
        // Enregistrer l'action dans les logs d'audit
        await logAudit(
            "Suppression d'utilisateur", 
            req.session.userId || "invité", 
            `Utilisateur avec ID ${req.params.id} supprimé.`
        );
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}
