const express = require('express');
const router = express.Router();
require('dotenv').config();
const authenticateToken = require("../middleware/auth");
const Location = require('../models/Locations');
const mongoose = require("mongoose");

const apiKey = process.env.OPENWEATHERMAP_API_KEY;


router.get('/weeklyForcast', async (req, res) => {
	try{
        const {city} = req.body;
	
	    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
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
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
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

router.delete("/deleteLocation/:id", authenticateToken, async (req, res) => {
    const locationId = new mongoose.Types.ObjectId(req.params.Id);

    console.log("Location ID " + locationId);
    console.log("User ID " + req.user.userId);
    try {
        const result = await Location.findOneAndDelete({
            _id: locationId,
            userId: req.user.userId
        });

        if (!result) {
            return res.status(404).json({ message: "Location not found or unauthorized"});
        }
        res.json({ message: "Location Deleted"});
    } catch (err) {
        console.error("Error deleting location: ", err);
        res.status(500).json({ message: "Server error"});
    }
});

router.post("/reverseGeocoding", async (req, res) => {
    try {
        const {lon, lat} = req.body;
        const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
        response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch(error) {
        console.error(error);
        res.status(500).json( {error: error.message})
    }
});




module.exports = router;