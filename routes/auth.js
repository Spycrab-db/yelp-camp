const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/WrapAsync');
const User = require('../models/user');
const passport = require('passport');
const { saveReturnTo } = require('../middleware');
const controller = require('../controllers/auth');

router.route('/register')
    .get(controller.renderRegister)
    .post(wrapAsync(controller.registerUser));

router.route('/login')
    .get(controller.renderLogin)
    .post(
        saveReturnTo,
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        wrapAsync(controller.loginUser))

router.get('/logout', controller.logoutUser);

module.exports = router;