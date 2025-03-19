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

require('dotenv').config(); // load all environment variables (NECESSARY FOR API KEY)
// if this doesn't work, use npm install dotenv to install the package

// initialize all schema
const express = require('express');
const mongoose = require('mongoose'); // for handling mongoDB application calls.
const jwt = require('jsonwebtoken'); // for user authentication through use of JSON Web Tokens.
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Establish middleware (CORS for cross-origin requests, body-parser for JSON parsing)
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) =>
{
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PATCH, DELETE, OPTIONS'
	);
	next();
});

// MONGO DB SETUP
// MONOGO_URI is the connection string to the database, found in the .env file.
	// 1. if the connection is successful, log it to the console.
	// 2. Force stop the server connection if the database connection fails. 
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB')) // 1.
.catch(err => { console.error('MongoDB connection error:', err); // 2.
	// process.exit(1);
});

// import and use authentication routes from backend>routes>authRoutes.js
const authRoutes = require('./backend/routes/authRoutes');
app.use('/api/auth', authRoutes);

//import the weather routes from the same folder as above.
const weatherRoutes = require('./backend/routes/weatherRoutes');
app.use('/api/weather', weatherRoutes);

// define the API key as outlined in the .env
const apiKey = process.env.OPENWEATHERMAP_API_KEY;

// THE FOLLOWING FUNCTION IS UNSAFE, AND IS ONLY TO CHECK TO SEE IF THE APIKEY IS WORKING
// this is probably worth deleting on deployment :)
console.log('API key loaded: ', apiKey); 

// server health check on general case
app.get('/api/', (req, res) => {
	res.send('Server is running...');
});

app.listen(5000); // start Node + Express server on port 5000
