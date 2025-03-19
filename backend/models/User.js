const mongoose = require('mongoose');

// define the general user schema for use with MongoDB
    // This is the data that is sent to the database.
        // 1. This is so wildly unsafe, it's stored just as plaintext.
        // If we want to encrypt it later, we can, but we're just testing it out.
const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}, // 1. 
});

module.exports = mongoose.model('User', userSchema); // export the user schema for use in the server.js file.