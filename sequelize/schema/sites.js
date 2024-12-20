import { DataTypes } from "sequelize";
import sequelize from '../config.js';
const Site = sequelize.define('Site', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    adresse: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT

    }
}, {
    timestamps: false
});
export default Site;