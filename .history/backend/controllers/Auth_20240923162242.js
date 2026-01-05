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

        req.session.userId = user.uuid;

        const uuid = user.uuid;
        const name = user.name;
        const email = user.email;
        const role = user.role;
        const status = user.status;
        await User.update({ status: "connected" }, { where: { uuid: user.uuid } });

        res.status(200).json({ uuid, name, email, role, status });
    } catch (error) {
        res.status(500).json({ msg: "Erreur serveur" });
    }
}

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
}

export const logOut = (req, res) => {
    if (!req.session.userId) {
        return res.status(400).json({ msg: "Impossible de se déconnecter" });
    }
    User.update({ status: "offline" }, { where: { uuid: req.session.userId } }) // Set status to "offline"
        .then(() => {
            req.session.destroy((err) => {
                if (err) return res.status(400).json({ msg: "Impossible de se déconnecter" });
                res.status(200).json({ msg: "Vous êtes déconnecté" });
            });
        })
        .catch((error) => {
            res.status(500).json({ msg: "Erreur serveur" });
        });
}
