//Dependencies
const express = require('express');
//Utils
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/WrapAsync');
//Models
const Campground = require("../models/camp-ground");
const Review = require("../models/review");
//ValidationSchema
const { reviewSchema } = require('../validationSchemas');
//Middlewares
const { validateId, checkAuthenticated, checkOwnReview} = require('../middleware');

const router = express.Router({
    mergeParams: true
});

//Validate review middleware
function validateReview(req, res, next){
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        next(new ExpressError(error.message, 400));
    } else {
        next();
    }
}

//Review routes
//POST new review route
router.use(validateId);
router.post('/', checkAuthenticated, validateReview, wrapAsync(async (req, res)=>{
    const review = new Review(req.body.review);
    reviewSchema.validate(review);
    review.author = req.user;
    req.campground.reviews.push(review);
    await Promise.all([req.campground.save(), review.save()]);
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${req.campground._id}`);
}));
//DELETE review route
router.delete('/:reviewId', checkAuthenticated, checkOwnReview, wrapAsync(async (req, res)=>{
    const {id, reviewId} = req.params;
    const detachReview = Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Promise.all([detachReview, Review.findByIdAndDelete(reviewId)]);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;