const passport = require('passport');

module.exports.checkAuthenticated = (req, res, next)=>{
    console.log(req.user);
    if (req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'An account is required');
    res.redirect('/login');
}