/*
	Immediately below is a 'dotenv' call to load the API key from a .env file.
	you have to load the API key through a locally stored .env file, because the API key is sensitive information.
	If at any point in time you need the API key for access, notify Caden and he will provide it.

	If, in any case you need it - check the discord and you may find it in the documentation channel.

	the .env is included in the .gitignore 

	the .env is included upon deployment in order to get the app to work.

	DO NOT UPLOAD THE .env FILE TO GITHUB OR ANY OTHER PUBLIC REPOSITORY.
	DO NOT HARDCODE THE API KEY INTO YOUR CODE.
*/

require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Enable CORS for all origins
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// MongoDB setup
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        // process.exit(1);
    });

// Import routes
const authRoutes = require('./backend/routes/authRoutes');
app.use('/api/auth', authRoutes);

const weatherRoutes = require('./backend/routes/weatherRoutes');
app.use('/api/weather', weatherRoutes);

// Server health check
app.get('/api/', (req, res) => {
    res.send('Server is running...');
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
