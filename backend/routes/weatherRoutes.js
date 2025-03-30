const express = require('express');
const router = express.Router();
require('dotenv').config();
const authenticateToken = require("../middleware/auth");
const Location = require('../models/Locations');

const apiKey = process.env.OPENWEATHERMAP_API_KEY;


router.get('/weeklyForcast', async (req, res) => {
	try{
        const {city} = req.body;
	
	    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
	    const response = await fetch(url);
	    const data = await response.json();

	    res.status(200).json(data);
} catch (error){
	console.error(error);
	res.status(500).json( {error: error.message});
}	
});

router.get('/currentWeather', async (req, res) => {
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

router.post("/addLocation", authenticateToken, async (req, res) => {
    try {
        const {city} = req.body;
        const userId = req.user.userId;
        const newLocation = new Location({city, userId});
        await newLocation.save();
        res.status(201).json({ message: "Location Saved"});
    } catch (err){
        res.status(500).json({message : "Error Saving Location"});
    }
});

router.get("/getLocations", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
  
    try {
      const locations = await Location.find({ userId });
      res.status(200).json(locations);
    } catch (err) {
      res.status(500).json({ message: "Error fetching locations" });
    }
  });


module.exports = router;