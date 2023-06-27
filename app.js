//Require all dependencies and modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./models/user');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const { validateId } = require('./middleware');
const app = express();

//Importing all routes
const campgroundRouter = require('./routes/campgrounds');
const reviewRouter = require('./routes/reviews');
const authRouter = require('./routes/auth');
const { log } = require('console');


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
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    if (!req.isAuthenticated() && req.originalUrl !== '/login' && req.originalUrl !== '/register'){
        req.session.returnTo = req.originalUrl;
    }
    next();
});
//Home route
app.get('/', (req, res) => {
    res.send("HOME");
});

//Use routers
app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);
app.use('/', authRouter);

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