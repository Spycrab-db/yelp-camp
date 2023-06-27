const Campground = require('../models/camp-ground');
const Review = require('../models/review');
const { reviewSchema } = require('../validationSchemas');

module.exports.createReview = async (req, res)=>{
    const review = new Review(req.body.review);
    reviewSchema.validate(review);
    review.author = req.user;
    req.campground.reviews.push(review);
    await Promise.all([req.campground.save(), review.save()]);
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${req.campground._id}`);
}

module.exports.deleteReview = async (req, res)=>{
    const {id, reviewId} = req.params;
    const detachReview = Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Promise.all([detachReview, Review.findByIdAndDelete(reviewId)]);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
}