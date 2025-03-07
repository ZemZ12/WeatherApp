const express = require('express');
const router = express.Router();
require('dotenv').config();

const apiKey = process.env.OPENWEATHERMAP_API_KEY;


app.get('/weeklyForcast', async (req, res) => {
	try{
        const {city} = req.body;
	
	    const url = `api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=7&appid=${apiKey}`;
	    const response = await fetch(url);
	    const data = await response.json();

	    
	    res.status(200).json(data);
} catch (error){
	console.error(error);
	res.status(500).json( {error: error.message});
}	
});

app.get('/currentWeather', async (req, res) => {
    try {
        const {city} = req.body;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        
        res.status(200).json(data);
    } catch(error) {
        console.error(error);
        res.status(500).json( {error: error.message});
    }



});



module.exports = router;