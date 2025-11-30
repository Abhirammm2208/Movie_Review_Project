const mongoose = require('mongoose');

// Review model for storing movie reviews with rating and reviewer information
const reviewSchema = new mongoose.Schema({
    movieName: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 10 },
    reviewText: { type: String, required: true, minlength: 30 },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Review', ReviewSchema);


