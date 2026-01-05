import AccountingEntry from "../models/AccountingEntryModel.js";
import Journal from "../models/JournalModel.js";
import { Op } from "sequelize";

export const getAccountingEntries = async (req, res) => {
    try {
        const entries = await AccountingEntry.findAll({
            attributes: ['uuid', 'date', 'description', 'amount', 'validated'],
            include: [{
                model: Journal,
                attributes: ['name']
            }]
        });
        // Modifier la valeur de 'validated' pour l'afficher sous forme de texte
        const formattedEntries = entries.map(entry => {
            return {
                ...entry.dataValues, // Récupérer les données existantes
                validated: entry.validated ? "Validé" : "Non validé" // Convertir en texte
            };
        });

        res.status(200).json(formattedEntries);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const getAccountingEntryById = async (req, res) => {
    try {
        const entry = await AccountingEntry.findOne({
            where: { uuid: req.params.id }
        });
        if (!entry) return res.status(404).json({ msg: "Données introuvables" });
        let response;
        if (req.role === "admin") {
            response = await AccountingEntry.findOne({
                attributes: ['uuid', 'date', 'description', 'amount', 'validated'],
                where: {
                    id: entry.id
                },
                include: [{
                    model: Journal,
                    attributes: ['name']
            }]
        });
        } 
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createAccountingEntry = async (req, res) => {
    const { date, description, amount, journalName } = req.body; // Utilisez journalName au lieu de journalId

    try {
        // Trouver le journal par son nom
        const journal = await Journal.findOne({ where: { name: journalName } });

        if (!journal) {
            return res.status(404).json({ msg: "Journal non trouvé" });
        }

        // Créer l'écriture comptable avec l'identifiant du journal trouvé
        await AccountingEntry.create({
            date,
            description,
            amount,
            journalId: journal.id // Utiliser l'id du journal trouvé
        });

        res.status(201).json({ msg: "Écriture comptable créée avec succès" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateAccountingEntry = async (req, res) => {
    try {
        const entry = await AccountingEntry.findOne({
            where: { uuid: req.params.id }
        });
        if (!entry) return res.status(404).json({ msg: "Données introuvables" });
        const { date, description, amount, validated } = req.body;
        await AccountingEntry.update({ date, description, amount, validated }, {
            where: { uuid: req.params.id }
        });
        res.status(200).json({ msg: "Écriture comptable mise à jour avec succès" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteAccountingEntry = async (req, res) => {
    try {
        const entry = await AccountingEntry.findOne({
            where: { uuid: req.params.id }
        });
        if (!entry) return res.status(404).json({ msg: "Données introuvables" });
        await AccountingEntry.destroy({
            where: { uuid: req.params.id }
        });
        res.status(200).json({ msg: "Écriture comptable supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const validateAccountingEntry = async (req, res) => {
    try {
        const entry = await AccountingEntry.findOne({
            where: { uuid: req.params.id }
        });
        if (!entry) return res.status(404).json({ msg: "Données introuvables" });
        await AccountingEntry.update({ validated: true }, {
            where: { uuid: req.params.id }
        });
        res.status(200).json({ msg: "Écriture comptable validée avec succès" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
