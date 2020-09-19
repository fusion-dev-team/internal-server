module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
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
  }),

  down: queryInterface => queryInterface.dropTable('users')
};
