// review / rating / createdAt / ref to tour / ref to user /
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required:[true, 'Review can not be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max:5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Review = models.model('Review', reviewSchema);

exports.const = Review;


