module.exports = (sequelize, Sequelize) => {
  const Request = sequelize.define('request', {
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
    }
  });

  Request.associate = (models) => {
    models.request.belongsTo(models.user, {
      foreignKey: 'authorId',
      as: 'createdBy'
    });

    models.request.belongsTo(models.user, {
      foreignKey: 'updatedById',
      as: 'updatedBy'
    });
  };

  return Request;
};
