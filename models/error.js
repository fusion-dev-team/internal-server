module.exports = (sequelize, DataTypes) => sequelize.define(
  'error',
  {
    filename: DataTypes.STRING,
    error: DataTypes.TEXT,
    routeName: DataTypes.STRING,
    user: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  },
  {}
);
