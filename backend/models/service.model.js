module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Service', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		price: {
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: 0,
		},
		durationMinutes: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 30,
		}
	}, {
		tableName: 'services'
	});
};
