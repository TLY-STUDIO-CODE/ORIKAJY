import Account from "../models/AccountModel.js";

export const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.findAll({
            attributes: ['uuid', 'name', 'type', 'balance']
        });
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createAccount = async (req, res) => {
    const { name, type } = req.body;
    try {
        await Account.create({ name, type });
        res.status(201).json({ msg: "Compte créé avec succès" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createBalance = async (req, res) => {
    const { name, type, amount } = req.body;
    try {
        // Trouver le compte par nom et type
        const account = await Account.findOne({
            where: { name, type }
        });

        if (!account) {
            return res.status(404).json({ msg: "Compte non trouvé" });
        }

        // Mettre à jour le solde du compte
        account.balance += parseFloat(amount); // Assurez-vous que 'amount' est un nombre
        await account.save();

        res.status(200).json({ msg: "Solde mis à jour avec succès", balance: account.balance });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const updateAccount = async (req, res) => {
    try {
        const account = await Account.findOne({
            where: { uuid: req.params.id }
        });
        if (!account) return res.status(404).json({ msg: "Données introuvables" });
        const { name, type, balance } = req.body;
        await Account.update({ name, type, balance }, {
            where: { uuid: req.params.id }
        });
        res.status(200).json({ msg: "Compte mis à jour avec succès" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const account = await Account.findOne({
            where: { uuid: req.params.id }
        });
        if (!account) return res.status(404).json({ msg: "Données introuvables" });
        await Account.destroy({
            where: { uuid: req.params.id }
        });
        res.status(200).json({ msg: "Compte supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
