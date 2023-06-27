const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('auth/register')
}

module.exports.renderLogin = (req, res) => {
    res.render('auth/login');
}

module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', "Welcome to Yelp Camp!");
            res.redirect('/campgrounds');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.loginUser = async (req, res) => {
    const url = res.locals.returnTo || '/campgrounds';
    req.flash('success', 'Welcome back!');
    res.redirect(url);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out!');
        res.redirect('/campgrounds');
    });
}