const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const connectToDatabase = require('./db');
const User = require('./user');
const { sessionOptions, verifySession } = require('./auth');

const app = express();
const port = 3000;

app.use(express.json());
app.use(session(sessionOptions));

connectToDatabase().catch(error => {
    console.error('Error connecting to database:', error);
    process.exit(1);
});

// User registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const newUser = new User({ username, email, password, role });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        req.session.user = { id: user._id, email: user.email, role: user.role };
        res.json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Error logging in user' });
    }
});

// Protected route
app.get('/api/protected', verifySession, (req, res) => {
    res.json({ message: `Hello ${req.session.user.email}, you are authorized to access this route` });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
