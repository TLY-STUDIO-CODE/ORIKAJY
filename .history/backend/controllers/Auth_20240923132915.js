import User from "../models/UserModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

// Fonction de connexion
export const Login = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) return res.status(404).json({ msg: "Utilisateur introuvable" });

        const match = await argon2.verify(user.password, req.body.password);
        if (!match) return res.status(400).json({ msg: "Mauvais mot de passe" });

        // Génération du token JWT
        const token = jwt.sign(
            {
                userId: user.uuid,
                role: user.role,
            },
            process.env.JWT_SECRET, // Assure-toi que JWT_SECRET est défini dans ton fichier .env
            { expiresIn: "1d" } // Expiration du token
        );

        res.status(200).json({ token, uuid: user.uuid, name: user.name, email: user.email, role: user.role, image: user.image });
    } catch (error) {
        console.error(error); // Ajoute cette ligne pour afficher les erreurs dans la console du serveur
        res.status(500).json({ msg: "Erreur serveur" });
    }
};

// Fonction pour récupérer les informations de l'utilisateur
export const Me = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ msg: "Non authentifié" });

        // Vérification du token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) return res.status(403).json({ msg: "Token invalide" });

            // Récupération de l'utilisateur
            const user = await User.findOne({
                attributes: ['uuid', 'name', 'email', 'role'],
                where: { uuid: decoded.userId }
            });
            if (!user) return res.status(404).json({ msg: "Utilisateur introuvable" });

            res.status(200).json(user);
        });
    } catch (error) {
        console.error(error); // Ajoute cette ligne pour afficher les erreurs dans la console du serveur
        res.status(500).json({ msg: "Erreur serveur" });
    }
};

// Fonction de déconnexion
export const logOut = (req, res) => {
    res.status(200).json({ msg: "Déconnecté" });
};

