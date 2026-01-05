import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// On utilise l'URL complète fournie par Supabase/Vercel en priorité
const db = new Sequelize(process.env.POSTGRES_URL || 'postgres://yassergenius:007yasser007@localhost:5432/Compta_BD', {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        // Le SSL est obligatoire pour se connecter à Supabase depuis Vercel
        ssl: process.env.POSTGRES_URL ? {
            require: true,
            rejectUnauthorized: false
        } : false
    },
    logging: false // Évite de polluer les logs de la console
});

export default db;