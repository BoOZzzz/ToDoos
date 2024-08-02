// event.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../index.js'); // Import the sequelize instance
const User = require('./user.js'); // Import the User model to create associations

// Define the Event model
const Event = sequelize.define('Event', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  recurrence: {
    type: DataTypes.STRING, // For example: 'daily', 'weekly', etc.
    allowNull: true,
  },
});

// Define associations between User and Event
Event.belongsTo(User, {
  foreignKey: 'userId', // Add userId foreign key in the Event table
  as: 'user',
});

// Export the Event model
module.exports = Event;
