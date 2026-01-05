
import Vente from "../models/VenteModel.js";
import Stock from "../models/StockModel.js";
import User from "../models/UserModel.js";

export const getVentes = async (req, res) => {
try {
        let response;
        if(req.role === "admin"){
            response = await Vente.findAll({
                attributes:['uuid', 'name', 'name_client', 'qte', 'categories', 'montant', 'date_vente'],
                include:[{
                    model: User, 
                    attributes:['name', 'email']
                }]
            });
        }else{
            response = await Vente.findAll({
                attributes:['uuid', 'name', 'name_client', 'qte', 'categories', 'montant', 'date_vente'],
                where:{
                    userId: req.userId
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
};



export const getVenteById = async (req, res) => {
try {
        const vente = await Vente.findOne({
            where: { 
                uuid: req.params.id 
            }
        });
        if (!vente) return res.status(404).json({ msg: "Données introuvables" });
        let response;
        if(req.role === "admin"){
            response = await Vente.findOne({
                attributes:['uuid', 'name', 'name_client', 'qte', 'categories', 'montant', 'date_vente'],
                where:{
                    id: vente.id
            },
                include:[{
                    model: User, 
                    attributes:['name', 'email']
                }]
            });
        }else{
            response = await Vente.findOne({
                attributes:['uuid', 'name', 'name_client', 'qte', 'categories', 'montant', 'date_vente'],
                where:{
                    [Op.and]:[{id: vente.id}, {userId: req.userId}]
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
};

export const createVente = async (req, res) => {
    const { name, description, categories, qte, montant, name_client, date_vente, stockId } = req.body;
    try {
        // Créer l'entrée de la vente
        const vente = await Vente.create({
            name, description, categories, qte, montant, name_client, date_vente, stockId, userId: req.userId
        });

        // Mettre à jour la quantité en stock
        const stock = await Stock.findOne({ where: { id: stockId } });
        if (stock) {
            stock.qte -= qte;
            await stock.save();
        }

        res.status(201).json({ msg: "Vente créée et stock mis à jour avec succès", vente });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
export const updateVente = async (req, res) => {
    try {
        const vente = await Vente.findOne({ where: { uuid: req.params.id } });
        if (!vente) return res.status(404).json({ msg: "Données introuvables" });

        const { name, description, categories, qte, montant, name_client, date_vente, stockId } = req.body;

        // Mettre à jour la quantité en stock avant la modification
        const stock = await Stock.findOne({ where: { id: vente.stockId } });
        if (stock) {
            stock.qte += vente.qte; // Rétablir l'ancienne quantité
            await stock.save();
        }

        // Mettre à jour l'entrée de la vente
        await Vente.update({ name, description, categories, qte, montant, name_client, date_vente, stockId }, {
            where: {
                id: vente.id
            }
        });

        // Mettre à jour la quantité en stock après la modification
        if (stock) {
            stock.qte -= qte; // Appliquer la nouvelle quantité
            await stock.save();
        }

        res.status(200).json({ msg: "Vente mise à jour et stock ajusté" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
export const deleteVente = async (req, res) => {
    try {
        const vente = await Vente.findOne({ where: { uuid: req.params.id } });
        if (!vente) return res.status(404).json({ msg: "Données introuvables" });

        // Mettre à jour la quantité en stock avant de supprimer la vente
        const stock = await Stock.findOne({ where: { id: vente.stockId } });
        if (stock) {
            stock.qte += vente.qte;
            await stock.save();
        }

        // Supprimer l'entrée de la vente
        await Vente.destroy({
            where: {
                id: vente.id
            }
        });

        res.status(200).json({ msg: "Vente supprimée et stock mis à jour" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
