const passport = require('passport');

module.exports.checkAuthenticated = (req, res, next)=>{
    if (req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'An account is required');
    res.redirect('/login');
}

module.exports.saveReturnTo = (req, res, next)=>{
    if (req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}