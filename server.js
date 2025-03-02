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

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
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

const apiKey = process.env.OPENWEATHERMAP_API_KEY;

// THE FOLLOWING FUNCTION IS UNSAFE, AND IS ONLY TO CHECK TO SEE IF THE APIKEY IS WORKING
console.log('API key loaded: ', apiKey); 

app.get('/api/weatherTest', async (req, res, next) => {
	try{
	
	const url = 'https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=' + apiKey;
	const response = await fetch(url);
	const data = await response.json();

	if(!response.ok) {
		//throw new Error(data.message || 'Error fetching weather data');
	}
	console.log(data);
	res.json(data);
} catch (error){
	console.error(error);
	res.status(500).json( {error: error.message});
}	
});

app.listen(5000); // start Node + Express server on port 5000
