// user.js

const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../index.js'); // Import the sequelize instance

// Define the User model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  regDate: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  // Other model options can go here
  // For example: timestamps: true, tableName: 'users', etc.
});

module.exports = User;
