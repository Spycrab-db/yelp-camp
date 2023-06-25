const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Review'
        }
    ]
    
});

//POST middleware to delete all reviews after deleting campground
campgroundSchema.post('findOneAndDelete', async function(campground){
    if (campground){
        for (let reviewId of campground.reviews){
            await Review.findByIdAndDelete(reviewId);
        }
    }
})

module.exports = mongoose.model("Campground", campgroundSchema);