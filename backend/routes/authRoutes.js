const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// User Registration Route
// Because we import ../models/user, don't need to import anything here 
// We can use the connected MongoDB database to create a new user. (a la server.js line 46).
router.post('/register', async (req, res) => {
    try {

        // define the username and password from the request body.
        const { username, password } = req.body;
        
        // Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user object and save to database using .save()
        user = new User({ username, password });
        
        // Mongoose Save function to save the user to the database.
        await user.save(); 

        // show off that status!
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // oof, something went wrong.
        res.status(500).json({ message: 'Server error' });
    }
});

// User Login Route
router.post('/login', async (req, res) => {
    try {
        // define a username and password for the req.body
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        
        // check to see if the current user exists, or if the password is correct.
        if (!user || user.password !== password) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token, using our seeded JWT key from the .env file.
        // The token is signed with the user's ID and expires in 1 hour.
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // send the token back to the client.
        res.json({ token });
    } catch (error) {
        // oof... something went wrong.
        res.status(500).json({ message: 'Server error' });
    }
});

// Export router for use in server.js
module.exports = router;
