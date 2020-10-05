/* eslint-disable */
const utils = require('../../utils');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
  
      firstName: {
        type: Sequelize.STRING,
        notEmpty: true
      },
      lastName: {
        type: Sequelize.STRING,
        notEmpty: true
      },
      login: {
        type: Sequelize.TEXT,
        allowNull: false,
        notEmpty: true,
        unique: true
      },
      phone: {
        type: Sequelize.STRING
      },
      info: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true
        }
      },
      avatar: {
        type: Sequelize.STRING
      },
      avatarThumbnail: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },  
      status: {
        type: Sequelize.ENUM('registered', 'active', 'disabled'),
        defaultValue: 'registered'
      },
      role: {
        type: Sequelize.ENUM(
          'admin',
          'manager',
          'user',
          'student'
        ),
        defaultValue: 'user'
      },
      dob: {
        type: Sequelize.DATE
      },
      resetPasswordToken: {
        type: Sequelize.TEXT
      },
      resetPasswordExpires: {
        type: Sequelize.DATE
      },
    },
    {
      getterMethods: {
        username() {
          if (this.firstName || this.lastName) {
            return `${this.firstName || ''} ${this.lastName || ''}`;
          }
          return this.login;
        }
      }
    }
  );

  User.beforeUpdate((instance, options) => {
    return instance;
  });

  User.beforeCreate(user => {
    if (user.isNewRecord && user.password) {
      user.password = utils.hash.generate(user.password);
    }
    return user;
  });

  User.associate = models => {
    // models.user.belongsToMany(models.project, {
    //   through: {
    //     model: models.user_project,
    //     unique: false
    //   },
    //   foreignKey: 'user_id'
    // });
    // models.user.belongsToMany(models.request, {
    //   through: {
    //     model: models.request_user,
    //     unique: false
    //   },
    //   foreignKey: 'user_id'
    // });
    // models.user.belongsToMany(models.plan, {
    //   through: {
    //     model: models.user_plan,
    //     unique: false
    //   },
    //   foreignKey: 'user_id'
    // });
    // models.user.belongsToMany(models.event, {
    //   through: {
    //     model: models.user_event,
    //     unique: false
    //   },
    //   foreignKey: 'user_id'
    // });
    // models.user.hasMany(models.message, {
    //   as: 'my_message',
    //   foreignKey: 'author_id'
    // });
    // models.user.belongsToMany(models.message, {
    //   as: 'subscribed',
    //   through: {
    //     model: models.messages_user,
    //     unique: true
    //   },
    //   foreignKey: 'user_id'
    // });
    // models.user.hasMany(models.subscription_notification, {
    //   foreignKey: 'user_id'
    // });
  };

  return User;
};
