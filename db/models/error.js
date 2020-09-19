module.exports = (sequelize, Sequelize) => sequelize.define(
  'error',
  {
    filename: Sequelize.STRING,
    error: Sequelize.TEXT,
    routeName: Sequelize.STRING,
    payload: Sequelize.JSONB,
    user: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  },
  {}
);
