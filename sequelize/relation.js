import Hauberge from './schema/hauberge.js';
import Resident from './schema/resident.js';
import BlackList from './schema/blacklist.js';
import Reservation from './schema/reservation.js';

// Define associations
Hauberge.hasMany(Reservation, { foreignKey: 'hauberge_id' });
Resident.hasMany(Reservation, { foreignKey: 'resident_id' });
Reservation.belongsTo(Hauberge, { foreignKey: 'hauberge_id' });
Reservation.belongsTo(Resident, { foreignKey: 'resident_id' });

Hauberge.belongsToMany(Resident, { through: 'Hauberge_Resident', foreignKey: 'hauberge_id' });
Resident.belongsToMany(Hauberge, { through: 'Hauberge_Resident', foreignKey: 'resident_id' });

export { Hauberge, Resident, BlackList, Reservation };