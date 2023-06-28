const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const campgroundSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    images: [imageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Review'
        }
    ],
},
    {
        toJSON: {
            virtuals: true
        }
    });
campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`
});

//POST middleware to delete all reviews after deleting campground
campgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground) {
        for (let reviewId of campground.reviews) {
            await Review.findByIdAndDelete(reviewId);
        }
    }
})

module.exports = mongoose.model("Campground", campgroundSchema);