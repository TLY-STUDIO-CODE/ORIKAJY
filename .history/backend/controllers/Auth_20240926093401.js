import User from "../models/UserModel.js";
import argon2 from "argon2";
import { logAudit } from "../controllers/Audit.js"; // Importer la fonction logAudit

export const Login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!user) {
            await logAudit("Connexion", "guest", `Tentative de connexion avec un email introuvable : ${req.body.email}`);
            return res.status(404).json({ msg: "Utilisateur introuvable" });
        }

        const match = await argon2.verify(user.password, req.body.password);
        if (!match) {
            await logAudit("Connexion", user.uuid, `Tentative de connexion échouée (mot de passe incorrect) pour l'utilisateur ${user.email}`);
            return res.status(400).json({ msg: "Mauvais mot de passe" });
        }

        req.session.userId = user.uuid;

        const uuid = user.uuid;
        const name = user.name;
        const email = user.email;
        const role = user.role;
        const status = user.status;

        // Mise à jour du statut de l'utilisateur en "connecté"
        await User.update({ status: "connected" }, { where: { uuid: user.uuid } });

        // Enregistrer l'action dans les logs d'audit
        await logAudit("Connexion", user.name, `Utilisateur connecté : ${user.email}`);

        res.status(200).json({ uuid, name, email, role, status });
    } catch (error) {
        res.status(500).json({ msg: "Erreur serveur" });
    }
};

export const Me = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ msg: "Veuillez vous connecter à votre compte !" });
        }

        const user = await User.findOne({
            attributes: ['uuid', 'name', 'email', 'role', 'image'], // Ajouter l'image ici
            where: {
                uuid: req.session.userId
            }
        });

        if (!user) return res.status(404).json({ msg: "Utilisateur introuvable" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: "Erreur serveur" });
    }
};

export const logOut = async (req, res) => {
    if (!req.session.userId) {
        return res.status(400).json({ msg: "Impossible de se déconnecter" });
    }

    try {
        // Mise à jour du statut de l'utilisateur en "déconnecté"
        await User.update({ status: "offline" }, { where: { uuid: req.session.userId } });

        // Enregistrer l'action dans les logs d'audit
        await logAudit("logOut", req.session.userId, `Utilisateur déconnecté : ${req.session.userId}`);

        req.session.destroy((err) => {
            if (err) return res.status(400).json({ msg: "Impossible de se déconnecter" });
            res.status(200).json({ msg: "Vous êtes déconnecté" });
        });
    } catch (error) {
        res.status(500).json({ msg: "Erreur serveur" });
    }
};

