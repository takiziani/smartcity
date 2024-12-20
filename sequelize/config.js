import { Sequelize } from "sequelize";
import dotenv from "dotenv";
// setting the database connection with supabase
dotenv.config();
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // This line will fix potential certificate issues
        }
    }
});
export default sequelize;