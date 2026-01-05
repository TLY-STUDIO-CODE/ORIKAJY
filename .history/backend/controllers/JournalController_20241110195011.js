import Journal from "../models/JournalModel.js";
import AccountingEntry from "../models/AccountingEntryModel.js";

export const getJournals = async (req, res) => {
    try {
        const journals = await Journal.findAll({
            attributes: ['uuid', 'name'],
            include: [{
                model: AccountingEntry, 
                attributes: ['date', 'description', 'amount', 'validated']
            }]
        });
        // Modifier la valeur de 'validated' pour l'afficher sous forme de texte
        const formattedEntries = journals.map(entry => {
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

export const getJournalById = async (req, res) => {
    try {
        const journal = await Journal.findOne({
            where: { uuid: req.params.id }
        });
        if (!journal) return res.status(404).json({ msg: "Données introuvables" });
        let response;
        if (req.role === "admin") {
            response = await Journal.findOne({
            attributes: ['uuid', 'name'],
            where: {
                    id: journal.id
                },
            include: [{
                model: AccountingEntry, 
                attributes: ['date', 'description', 'amount', 'validated']
            }]
        });
        } 
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const createJournal = async (req, res) => {
    const { name } = req.body;
    try {
        await Journal.create({ name });
        res.status(201).json({ msg: "Journal créé avec succès" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateJournal = async (req, res) => {
    try {
        const journal = await Journal.findOne({
            where: { uuid: req.params.id }
        });
        if (!journal) return res.status(404).json({ msg: "Données introuvables" });
        const { name } = req.body;
        await Journal.update({ name }, {
            where: { uuid: req.params.id }
        });
        res.status(200).json({ msg: "Journal mise à jour avec succès" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const deleteJournal = async (req, res) => {
    try {
        const journal = await Journal.findOne({
            where: { uuid: req.params.id }
        });
        if (!journal) return res.status(404).json({ msg: "Données introuvables" });
        await Journal.destroy({
            where: { uuid: req.params.id }
        });
        res.status(200).json({ msg: "Journal supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const assignEntriesToJournal = async (req, res) => {
const { journalName, description } = req.body;

try {
// Trouver le journal par son nom
const journal = await Journal.findOne({ where: { name: journalName } });

if (!journal) {
    return res.status(404).json({ msg: "Journal introuvable" });
}

// Trouver les écritures comptables par description
const accountingEntries = await AccountingEntry.findAll({ where: { description } });

if (accountingEntries.length === 0) {
    return res.status(404).json({ msg: "Aucune écriture comptable correspondante trouvée" });
}

// Mettre à jour le journalId des écritures comptables correspondantes
await AccountingEntry.update({ journalId: journal.id }, {
    where: {
    description: description
    }
});

res.status(200).json({ msg: "Écritures affectées au journal avec succès" });
} catch (error) {
res.status(500).json({ msg: error.message });
}
};


