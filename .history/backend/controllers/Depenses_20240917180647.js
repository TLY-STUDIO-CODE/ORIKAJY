import Achat from "../models/AchatModel.js";
import { Op } from "sequelize";

export const getDepenses = async (req, res) => {
    const { date } = req.params;

    try {
        const totalDepenses = await Achat.sum('montant_total', {
            where: {
                date_achat: {
                    [Op.eq]: date
                }
            }
        });

        res.status(200).json({ totalDepenses });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
