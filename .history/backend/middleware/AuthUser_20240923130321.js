import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
const authHeader = req.headers.authorization;
const token = authHeader && authHeader.split(' ')[1];
if (!token) return res.status(401).json({ msg: "Non authentifié" });

jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
if (err) return res.status(403).json({ msg: "Token invalide" });

const user = await User.findOne({ where: { uuid: decoded.userId } });
if (!user) return res.status(404).json({ msg: "Utilisateur introuvable" });

req.userId = user.id;
req.role = user.role;
next();
});
};

export const adminOnly = async (req, res, next) => {
const authHeader = req.headers.authorization;
const token = authHeader && authHeader.split(' ')[1];
if (!token) return res.status(401).json({ msg: "Non authentifié" });

jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
if (err) return res.status(403).json({ msg: "Token invalide" });

const user = await User.findOne({ where: { uuid: decoded.userId } });
if (!user) return res.status(404).json({ msg: "Utilisateur introuvable" });
if (user.role !== "admin") return res.status(403).json({ msg: "Accès interdit" });

next();
});
};
