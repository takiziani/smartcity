import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Resident = sequelize.define('Resident', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date_naissance: {
        type: DataTypes.DATE
    },
    lieu_naissance: {
        type: DataTypes.STRING
    },
    sexe: {
        type: DataTypes.ENUM('Homme', 'Femme')
    },
    numero_carte_identite: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    permission_parentale: {
        type: DataTypes.BOOLEAN
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    telephone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    refreshToken: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
    hooks: {
        beforeSave: (user) => {
            if (user.email) {
                user.email = user.email.toLowerCase();
            }
        }
    }
});

export default Resident;