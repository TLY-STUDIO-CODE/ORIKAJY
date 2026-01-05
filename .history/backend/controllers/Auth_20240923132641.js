import User from "../models/UserModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

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
    process.env.JWT_SECRET, // Mettre à jour ton fichier .env avec JWT_SECRET
    { expiresIn: "1d" } // Expiration du token
);

res.status(200).json({ token, uuid: user.uuid, name: user.name, email: user.email, role: user.role, image: user.image });
} catch (error) {
res.status(500).json({ msg: "Erreur serveur" });
}
};

export const Me = async (req, res) => {
try {
const authHeader = req.headers.authorization;
const token = authHeader && authHeader.split(' ')[1];
if (!token) return res.status(401).json({ msg: "Non authentifié" });

jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Token invalide" });

    const user = await User.findOne({
    attributes: ['uuid', 'name', 'email', 'role'],
    where: { uuid: decoded.userId }
    });
    if (!user) return res.status(404).json({ msg: "Utilisateur introuvable" });

    res.status(200).json(user);
});
} catch (error) {
res.status(500).json({ msg: "Erreur serveur" });
}
};

export const logOut = (req, res) => {
res.status(200).json({ msg: "Déconnecté" });
};
