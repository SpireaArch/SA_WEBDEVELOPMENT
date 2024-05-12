const express = require('express');
const connectToDatabase = require('./db');
const User = require('./user');

const app = express();
const port = 3000;

app.use(express.json());

// Connect to MongoDB
connectToDatabase().catch((error) => {
    console.error('Error connecting to database:', error);
    process.exit(1); // Exit the process if unable to connect to the database
});

// Create a new user
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const newUser = new User({ name, email, age });
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
});

// Retrieve all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Error retrieving users' });
    }
});

// Update a user by ID
app.put('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, age } = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, { name, email, age }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error updating user' });
    }
});

// Delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
