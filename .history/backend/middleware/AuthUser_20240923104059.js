import User from "../models/UserModel.js";

// Middleware pour vérifier si l'utilisateur est connecté
export const verifyUser = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Veuillez vous connecter à votre compte !" });
    }

    try {
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });

        if (!user) return res.status(404).json({ msg: "Utilisateur introuvable" });

        // Si l'utilisateur est trouvé, on ajoute son ID et son rôle dans la requête
        req.userId = user.id;
        req.role = user.role;

        // Vérifier si l'utilisateur est déjà connecté dans une autre session
        if (!req.session.connections) {
            req.session.connections = [];
        }
        
        // Ajouter l'utilisateur à la liste des connexions s'il n'est pas déjà connecté
        if (!req.session.connections.includes(req.session.userId)) {
            req.session.connections.push(req.session.userId);
        }

        next();
    } catch (error) {
        return res.status(500).json({ msg: "Erreur serveur" });
    }
}

// Middleware pour vérifier si l'utilisateur est un administrateur
export const adminOnly = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });

        if (!user) return res.status(404).json({ msg: "Utilisateur introuvable" });
        if (user.role !== "admin") return res.status(403).json({ msg: "Accès interdit" });

        next();
    } catch (error) {
        return res.status(500).json({ msg: "Erreur serveur" });
    }
}
