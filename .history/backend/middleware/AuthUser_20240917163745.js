import User from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
    const sessionKey = req.session.userId_admin || req.session.userId_user || req.session.userId_manager;

    if (!sessionKey) {
        return res.status(401).json({ msg: "Veuillez vous connecter à votre compte !" });
    }

    const user = await User.findOne({
        where: {
            uuid: sessionKey
        }
    });
    if (!user) return res.status(404).json({ msg: "Utilisateur introuvable" });

    req.userId = user.id;
    req.role = user.role;
    next();
};

export const adminOnly = async (req, res, next) => {
    const user = await User.findOne({
        where: {
            uuid: req.session.userId_admin
        }
    });
    if (!user) return res.status(404).json({ msg: "Utilisateur introuvable" });
    if (user.role !== "admin") return res.status(403).json({ msg: "Accès interdit" });
    next();
};
