import Hauberge from './schema/hauberge.js';
import Resident from './schema/resident.js';
import BlackList from './schema/blacklist.js';
import Reservation from './schema/reservation.js';
import Site from './schema/sites.js';

// Define associations
Hauberge.hasMany(Reservation, { foreignKey: 'hauberge_id' });
Resident.hasMany(Reservation, { foreignKey: 'resident_id' });
Reservation.belongsTo(Hauberge, { foreignKey: 'id' });
Reservation.belongsTo(Resident, { foreignKey: 'id' });
export { Hauberge, Resident, BlackList, Reservation, Site };