const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    city: {type: String, required: true},
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
    }
});

module.exports = mongoose.model('Location', locationSchema, 'Locations');