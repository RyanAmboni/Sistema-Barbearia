const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user.model')(sequelize, Sequelize.DataTypes);
const Service = require('./service.model')(sequelize, Sequelize.DataTypes);
const Appointment = require('./appointment.model')(sequelize, Sequelize.DataTypes);

// Associations
User.hasMany(Appointment, { foreignKey: 'userId' });
Appointment.belongsTo(User, { foreignKey: 'userId' });
Service.hasMany(Appointment, { foreignKey: 'serviceId' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId' });

module.exports = { sequelize, User, Service, Appointment };
