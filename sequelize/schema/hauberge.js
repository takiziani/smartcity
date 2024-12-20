import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Hauberge = sequelize.define('Hauberge', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: DataTypes.ENUM('maison', 'camp'),
        allowNull: false
    },
    capacite: {
        type: DataTypes.INTEGER
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    emplacement: {
        type: DataTypes.STRING // Coordonnées GPS
    },
    adresse: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telephone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    nbr_personne_reserve: {
        type: DataTypes.INTEGER
    },
    disponibilite: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    image_list: {
        type: DataTypes.JSON //Liste des liens de chemins
    },
    offres: {
        type: DataTypes.JSON //Liste des offres de l'établissement
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
}
);

export default Hauberge;