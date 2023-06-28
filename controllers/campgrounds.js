const Campground = require('../models/camp-ground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({accessToken: process.env.MAPBOX_TOKEN});

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = async (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    const geodata = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geodata.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
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
    const promises = [];
    promises.push(req.campground.updateOne(req.body.campground));
    if (req.body.deleteImages) {
        for (let image of req.body.deleteImages){
            promises.push(cloudinary.uploader.destroy(image));
        }
        promises.push(req.campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } }));
    }
    await Promise.all(promises);
    const imageArr = req.files.map(f => ({ url: f.path, filename: f.filename }));
    req.campground.images.push(...imageArr);
    await req.campground.save();
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${req.params.id}`);
}

module.exports.deleteCampground = async (req, res) => {
    req.campground.deleteOne();
    req.flash('success', 'Successfully deleted campground!');
    res.redirect(`/campgrounds`);
}