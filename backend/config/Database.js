import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// On utilise l'URL de Supabase si elle existe, sinon la base locale
const db = new Sequelize(process.env.POSTGRES_URL || 'postgres://yassergenius:007yasser007@localhost:5432/Compta_BD', {
    dialect: 'postgres',
    dialectOptions: {
        // Obligatoire pour la connexion sécurisée à Supabase
        ssl: process.env.POSTGRES_URL ? {
            require: true,
            rejectUnauthorized: false
        } : false
    },
    logging: false
});

export default db;