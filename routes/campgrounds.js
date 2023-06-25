const express = require('express');
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/WrapAsync');
const Campground = require("../models/camp-ground");
const { checkAuthenticated, validateCampground, checkPermission, validateId } = require('../middleware');

const router = express.Router();

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
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'You made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));
//Show campground route
router.get('/:id', validateId, wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    if (!campground) {
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
    } else {
        console.log(campground);
        res.render('campgrounds/show', { campground });
    }
}));
//Render edit campground route
router.get('/:id/edit', validateId, checkAuthenticated, checkPermission, wrapAsync(async (req, res) => {
    res.render('campgrounds/edit', { campground: req.campground });
}));
//Edit campground route
router.put('/:id', validateId, checkAuthenticated, checkPermission, validateCampground, wrapAsync(async (req, res) => {
    await req.campground.updateOne(req.body.campground);
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${req.params.id}`);
}));
//Delete campground route
router.delete('/:id', validateId, checkAuthenticated, checkPermission, wrapAsync(async (req, res) => {
    req.campground.deleteOne();
    req.flash('success', 'Successfully deleted campground!');
    res.redirect(`/campgrounds`);
}));

module.exports = router;