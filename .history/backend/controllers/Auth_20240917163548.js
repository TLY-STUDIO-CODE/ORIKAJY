import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!user) return res.status(404).json({ msg: "Utilisateur introuvable" });

        const match = await argon2.verify(user.password, req.body.password);
        if (!match) return res.status(400).json({ msg: "Mauvais mot de passe" });

        // Use different session keys for each role
        req.session[`userId_${user.role}`] = user.uuid;

        const uuid = user.uuid;
        const name = user.name;
        const email = user.email;
        const role = user.role;

        res.status(200).json({ uuid, name, email, role });
    } catch (error) {
        res.status(500).json({ msg: "Erreur serveur" });
    }
};

export const Me = async (req, res) => {
    try {
        // Handle session per role, checking if the user is logged in for the current role
        const sessionKey = req.session.userId_admin || req.session.userId_user || req.session.userId_manager;

        if (!sessionKey) {
            return res.status(401).json({ msg: "Veuillez vous connecter à votre compte !" });
        }

        const user = await User.findOne({
            attributes: ['uuid', 'name', 'email', 'role', 'image'], // Ajouter l'image ici
            where: {
                uuid: sessionKey
            }
        });

        if (!user) return res.status(404).json({ msg: "Utilisateur introuvable" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: "Erreur serveur" });
    }
};

export const logOut = (req, res) => {
    const roles = ['admin', 'user', 'manager']; // List all roles
    roles.forEach(role => {
        req.session[`userId_${role}`] = null; // Clear sessions for each role
    });

    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: "Impossible de se déconnecter" });
        res.status(200).json({ msg: "Vous êtes déconnecté" });
    });
};
