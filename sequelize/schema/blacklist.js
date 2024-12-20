import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const BlackList = sequelize.define('BlackList', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nom: {
        type: DataTypes.STRING
    },
    prenom: {
        type: DataTypes.STRING
    },
    numero_carte_identite: {
        type: DataTypes.STRING,
        unique: true
    }
});

export default BlackList;