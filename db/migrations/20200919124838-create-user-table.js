module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
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

  down: queryInterface => queryInterface.dropTable('users')
};
