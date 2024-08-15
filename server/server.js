// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./index.js'); // Import Sequelize instance
const User = require('./models/user.js'); // Import User model
const Event = require('./models/event.js'); // Import Event model
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const bcrypt = require('bcrypt');

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies

// Routes
app.use(cors({
  origin: 'http://localhost:9000' // Allow only your React app's origin
}));

// Create a new user
app.post('/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password:hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get a single user by ID
app.get('/users/id/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.get('/users/email/:email', async (req, res) => {
  try{
    console.log("requested email:", req.params.email);
    const user = await User.findOne({ where: { email: req.params.email } });
    //console.log("user: ", user);
    if (!user) {
      return res.status(204).send(); // 204 No Content with an empty response
    }
    res.json(user);

  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user"});
  }
})


// Update a user
app.put('/users/:id', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const [updated] = await User.update(
      { username, email, password },
      { where: { id: req.params.id } }
    );

    if (updated) {
      const updatedUser = await User.findByPk(req.params.id);
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Create a new event
app.post('/events', async (req, res) => {
  try {
    const { title, description, startTime, endTime, recurrence, userId } = req.body;
    const event = await Event.create({ title, description, startTime, endTime, recurrence, userId });
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Get all events
app.get('/events', async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{ model: User, as: 'user', attributes: ['username', 'email'] }]
    });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get a single event by ID
app.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{ model: User, as: 'user', attributes: ['username', 'email'] }]
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Update an event
app.put('/events/:id', async (req, res) => {
  try {
    const { title, description, startTime, endTime, recurrence, userId } = req.body;
    const [updated] = await Event.update(
      { title, description, startTime, endTime, recurrence, userId },
      { where: { id: req.params.id } }
    );

    if (updated) {
      const updatedEvent = await Event.findByPk(req.params.id, {
        include: [{ model: User, as: 'user', attributes: ['username', 'email'] }]
      });
      res.json(updatedEvent);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete an event
app.delete('/events/:id', async (req, res) => {
  try {
    const deleted = await Event.destroy({ where: { id: req.params.id } });

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
