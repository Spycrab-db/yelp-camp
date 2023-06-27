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
//Controller
const controller = require('../controllers/reviews');

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
router.post('/', checkAuthenticated, validateReview, wrapAsync(controller.createReview));
//DELETE review route
router.delete('/:reviewId', checkAuthenticated, checkOwnReview, wrapAsync(controller.deleteReview));

module.exports = router;