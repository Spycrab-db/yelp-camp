const express = require('express');
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/WrapAsync');
const Campground = require("../models/camp-ground");
const controller = require('../controllers/campgrounds');
const { checkAuthenticated, validateCampground, checkOwnCamp, validateId } = require('../middleware');

const router = express.Router();

//Campgrounds route
router.get('/', wrapAsync(controller.index));

//Render new campground route
router.get('/new', checkAuthenticated, wrapAsync(controller.renderNewForm));

//Post new campground route
router.post('/', checkAuthenticated, validateCampground, wrapAsync(controller.createCampground));

//Show campground route
router.get('/:id', validateId, wrapAsync(controller.renderCampground));

//Render edit campground route
router.get('/:id/edit', validateId, checkAuthenticated, checkOwnCamp, wrapAsync(controller.renderEditForm));

//Edit campground route
router.put('/:id', validateId, checkAuthenticated, checkOwnCamp, validateCampground, wrapAsync(controller.editCampground));

//Delete campground route
router.delete('/:id', validateId, checkAuthenticated, checkOwnCamp, wrapAsync(controller.deleteCampground));

module.exports = router;