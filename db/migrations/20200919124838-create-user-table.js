module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },

    firstNameEn: {
      type: Sequelize.STRING,
      notEmpty: true
    },
    firstNameRu: {
      type: Sequelize.STRING,
      notEmpty: true
    },

    lastNameEn: {
      type: Sequelize.STRING,
      notEmpty: true
    },
    lastNameRu: {
      type: Sequelize.STRING,
      notEmpty: true
    },

    educationEn: {
      type: Sequelize.TEXT
    },
    educationRu: {
      type: Sequelize.TEXT
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
    repo: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },

    status: {
      type: Sequelize.ENUM('registered', 'active', 'disabled'),
      defaultValue: 'registered'
    },
    role: {
      type: Sequelize.ENUM(
        'admin',
        'sales',
        'manager',
        'hr',
        'teacher',
        'user',
        'student'
      ),
      defaultValue: 'user'
    },
    dob: {
      type: Sequelize.DATE
    },
    slackName: {
      type: Sequelize.STRING
    },
    resetPasswordToken: {
      type: Sequelize.TEXT
    },
    resetPasswordExpires: {
      type: Sequelize.DATE
    },
    slackConversationalId: {
      type: Sequelize.STRING
    }
  }),

  down: queryInterface => queryInterface.dropTable('users')
};
