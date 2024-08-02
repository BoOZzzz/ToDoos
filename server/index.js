// index.js

const { Sequelize } = require('sequelize');

// Initialize a new Sequelize instance with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' // Path to SQLite file
});

// Export the sequelize instance
module.exports = { sequelize };
