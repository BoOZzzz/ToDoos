// sync.js

const { sequelize } = require('./index');
const User = require('./models/user'); // Import your User model

// Synchronize all models with the database
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ force: true }); // Use { force: true } to drop tables and recreate them
    console.log('Database & tables created!');

    // Optional: Insert a test user
    // await User.create({
    //   username: 'testuser',
    //   email: 'testuser@example.com',
    //   password: 'testuser'
    // });

    console.log('Test user added.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close(); // Close the database connection
  }
})();
