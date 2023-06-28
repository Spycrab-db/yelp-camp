const express = require('express');
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/WrapAsync');
const Campground = require("../models/camp-ground");
const controller = require('../controllers/campgrounds');
const { checkAuthenticated, validateCampground, checkOwnCamp, validateId } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const router = express.Router();

//General campgrounds route
router.route('/')
    .get(wrapAsync(controller.index))
    .post(
        checkAuthenticated,
        upload.array('image'),
        validateCampground,
        wrapAsync(controller.createCampground));

//Render new campground route
router.get('/new', checkAuthenticated, wrapAsync(controller.renderNewForm));

//Individual campground route
router.route('/:id')
    .get(validateId, wrapAsync(controller.renderCampground))
    .put(
        validateId,
        checkAuthenticated,
        checkOwnCamp,
        upload.array('image'),
        validateCampground,
        wrapAsync(controller.editCampground))
    .delete(
        validateId,
        checkAuthenticated,
        checkOwnCamp,
        wrapAsync(controller.deleteCampground));

//Render edit campground route
router.get('/:id/edit',
    validateId,
    checkAuthenticated,
    checkOwnCamp,
    wrapAsync(controller.renderEditForm));

module.exports = router;