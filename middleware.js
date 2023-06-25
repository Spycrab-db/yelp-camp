const passport = require('passport');
const Campground = require('./models/camp-ground');
const wrapAsync = require('./utils/WrapAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema } = require('./validationSchemas');

module.exports.checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'An account is required');
    res.redirect('/login');
}

module.exports.validateCampground = (req, res, next)=>{
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        next(new ExpressError(error.message, 400));
    } else {
        next();
    }
}

module.exports.saveReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateId = async (req, res, next)=>{
    try {
        req.campground = await Campground.findById(req.params.id);
        if (!req.campground) {
            throw new Error();
        }
        next();
    } catch (e) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
}

module.exports.checkPermission = wrapAsync(async (req, res, next) => {
    if (!req.campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
});