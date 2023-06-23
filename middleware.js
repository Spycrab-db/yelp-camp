const passport = require('passport');

module.exports.checkAuthenticated = (req, res, next)=>{
    if (req.isAuthenticated()){
        console.log("AUTHENTICATED");
        return next();
    }
    req.flash('error', 'An account is required');
    res.redirect('/login');
}