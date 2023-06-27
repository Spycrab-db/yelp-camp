const Campground = require('../models/camp-ground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = async (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'You made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.renderCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    .populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    })
    .populate('author');
    if (!campground) {
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
    } else {
        res.render('campgrounds/show', { campground });
    }
}

module.exports.renderEditForm = async (req, res) => {
    res.render('campgrounds/edit', { campground: req.campground });
}

module.exports.editCampground = async (req, res) => {
    await req.campground.updateOne(req.body.campground);
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${req.params.id}`);
}

module.exports.deleteCampground = async (req, res) => {
    req.campground.deleteOne();
    req.flash('success', 'Successfully deleted campground!');
    res.redirect(`/campgrounds`);
}