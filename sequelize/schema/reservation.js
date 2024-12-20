import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
import Hauberge from './hauberge.js';
import Resident from './resident.js';

const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    hauberge_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Hauberge,
            key: 'id'
        }
    },
    resident_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Resident,
            key: 'id'
        }
    },
    numero_chambre: {
        type: DataTypes.INTEGER
    },
    date_entree: {
        type: DataTypes.DATE
    },
    date_sortie: {
        type: DataTypes.DATE
    },
    nature_reservation: {
        type: DataTypes.ENUM('Gratuit', 'Non Gratuit')
    },
    restauration_montant: {
        type: DataTypes.DECIMAL(10, 2)
    }
});

export default Reservation;