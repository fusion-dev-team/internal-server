module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('errors', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    filename: Sequelize.STRING,
    text: Sequelize.TEXT,
    routeName: Sequelize.STRING,
    payload: Sequelize.JSONB,
    user: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }),

  down: queryInterface => queryInterface.dropTable('errors')
};
