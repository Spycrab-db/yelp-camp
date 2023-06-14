const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campGroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

module.exports = mongoose.model("Campground", campGroundSchema);