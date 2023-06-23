const express = require('express');
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/WrapAsync');
const Campground = require("../models/camp-ground");
const { checkAuthenticated } = require('../middleware');
const { campgroundSchema } = require('../validationSchemas');

const router = express.Router();

//Validate campground middleware
function validateCampground(req, res, next) {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        next(new ExpressError(error.message, 400));
    } else {
        next();
    }
}

//Campgrounds route
router.get('/', wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));
//Render new campground route
router.get('/new', checkAuthenticated, wrapAsync(async (req, res) => {
    res.render('campgrounds/new');
}));
//Post new campground route
router.post('/', checkAuthenticated, validateCampground, wrapAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'You made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));
//Show campground route
router.get('/:id', wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
    } else {
        res.render('campgrounds/show', { campground });
    }
}));
//Render edit campground route
router.get('/:id/edit', wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
    } else {
        res.render('campgrounds/edit', { campground });
    }
}));
//Edit campground route
router.put('/:id', validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${id}`);
}));
//Delete campground route
router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    deletedCamp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect(`/campgrounds`);
}));

module.exports = router;