module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('requests', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },

    title: {
      type: Sequelize.TEXT
    },
    type: {
      type: Sequelize.ENUM('technical', 'vacation', 'medical', 'dayOff', 'common', 'documents'),
      notEmpty: true
    },
    dateFrom: {
      type: Sequelize.DATE
    },
    dateTo: {
      type: Sequelize.DATE
    },
    comment: {
      type: Sequelize.TEXT
    },
    status: {
      type: Sequelize.ENUM('wait', 'completed', 'denied', 'inProgress'),
      notEmpty: true,
      defaultValue: 'wait'
    },
    deniedComment: {
      type: Sequelize.TEXT
    },
    restDaysNumber: {
      type: Sequelize.INTEGER
    },
    authorId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    updatedById: {
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

  down: async queryInterface => queryInterface.dropTable('requests')
};
