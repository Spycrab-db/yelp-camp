const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/WrapAsync');
const User = require('../models/user');
const passport = require('passport');
const { saveReturnTo } = require('../middleware');
const controller = require('../controllers/auth');

router.get('/register', wrapAsync(controller.renderRegister));

router.get('/login', controller.renderLogin);

router.post('/register', wrapAsync(controller.registerUser));

router.post('/login', saveReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), wrapAsync(controller.loginUser))

router.get('/logout', controller.logoutUser);

module.exports = router;