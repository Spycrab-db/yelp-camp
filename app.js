//Require all dependencies and modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const wrapAsync = require('./utils/WrapAsync');
const methodOverride = require('method-override');
const app = express();
const Campground = require("./models/camp-ground");

//Connect to MongoDB
try {
    mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then(() => {
        console.log("DATABASE CONNECTED");
    });
} catch (e) {
    console.log("ERROR CONNECTING TO MONGODB");
    console.log(e);
}

//Configure Express
app.set('view engine', "ejs");
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//Home route
app.get('/', (req, res) => {
    res.send("HOME");
});
//Campgrounds route
app.get('/campgrounds', wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));
//Render new campground route
app.get('/campgrounds/new', wrapAsync(async (req, res) => {
    res.render('campgrounds/new');
}));
//Post new campground route
app.post('/campgrounds', wrapAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));
//Show campground route
app.get('/campgrounds/:id', wrapAsync(async (req, res) => {
    ;
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
}));
//Render edit campground route
app.get('/campgrounds/:id/edit', wrapAsync(async (req, res) => {
    ;
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));
//Edit campground route
app.put('/campgrounds/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${id}`);
}));
//Delete campground route
app.delete('/campgrounds/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    deletedCamp = await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}));

//404 error handler
app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
});

//Final error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no! Something went wrong!"
    res.status(statusCode).render('error', { err });
});
//Confirm server is running
app.listen(3000, () => {
    console.log("LISTENING AT PORT 3000");
});