//Require all dependencies and modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const app = express();
const Campground = require("./models/camp-ground");

//Connect to MongoDB
try{
    mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then(()=>{
        console.log("DATABASE CONNECTED");
    });
} catch(e){
    console.log("ERROR CONNECTING TO MONGODB");
    console.log(e);
}

//Configure Express
app.set('view engine', "ejs");
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//Home route
app.get('/', (req, res)=>{
    res.send("HOME");
});
//Campgrounds route
app.get('/campgrounds', async (req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
});
//Render new campground route
app.get('/campgrounds/new', async (req, res)=>{
    res.render('campgrounds/new');
});
//Post new campground route
app.post('/campgrounds', async (req, res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});
//Show campground route
app.get('/campgrounds/:id', async (req, res)=>{;
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
});

//Render edit campground route
app.get('/campgrounds/:id/edit', async (req, res)=>{;
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
});
//Edit campground route
app.put('/campgrounds/:id', async (req, res)=>{
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${id}`);
});
//Delete campground route
app.delete('/campgrounds/:id', async (req, res)=>{
    const { id } = req.params;
    deletedCamp = await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
})
//Confirm server is running
app.listen(3000, ()=>{
    console.log("LISTENING AT PORT 3000");
});