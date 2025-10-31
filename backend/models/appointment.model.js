module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Appointment', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		serviceId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		scheduledAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'scheduled'
		}
	}, {
		tableName: 'appointments'
	});
};
