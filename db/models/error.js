module.exports = (sequelize, Sequelize) => {
  const ErrorModel = sequelize.define(
    'error',
    {
      filename: Sequelize.STRING,
      error: Sequelize.TEXT,
      routeName: Sequelize.STRING,
      payload: Sequelize.JSONB
    },
    {}
  );

  ErrorModel.associate = (models) => {
    models.error.belongsTo(models.user, {
      foreignKey: 'userId'
    });
  };
  return ErrorModel;
};
