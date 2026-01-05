import { Sequelize } from "sequelize";

// On utilise directement l'URL de connexion Supabase (POSTGRES_URL)
const db = new Sequelize('postgres://postgres.ejubaceekusbnnmvhzwl:4zx8P4erLAK0VAzC@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

export default db;
