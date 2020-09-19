module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('userTokens', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    refresh: Sequelize.STRING,
    access: Sequelize.STRING,
    device: Sequelize.STRING,
    userId: {
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

  down: queryInterface => queryInterface.dropTable('userTokens')
};
