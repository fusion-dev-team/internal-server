module.exports = (sequelize, Sequelize) => {
  const userToken = sequelize.define(
    'userToken',
    {
      refresh: Sequelize.STRING,
      access: Sequelize.STRING,
      device: Sequelize.STRING
    },
    {}
  );
  userToken.associate = (models) => {
    models.userToken.belongsTo(models.user, {
      foreignKey: 'userId'
    });
  };
  return userToken;
};
