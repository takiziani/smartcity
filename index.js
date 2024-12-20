import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from './cors/corsoptions.js';
import { credentials } from './cors/cridentials.js';
import sequelize from './sequelize/config.js';
import './sequelize/relation.js'; // Import models and associations
import router from './routes/index.js';

dotenv.config(); // Ensure this is called before using any environment variables

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOptions));
app.use(router);

// Initialize database connection and synchronize models
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        // Sync all models at once
        return sequelize.sync({ force: false, alter: true });
    })
    .then(() => {
        console.log('Database synchronized');
        // Start the server after database synchronization
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });