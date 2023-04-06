const express = require('express');

const locationService = require('../services/location-categories');

const router = express.Router();

/* GET api/location-categories */
router.get('/', async (req, res, next) => {
    try {
        res.json(await locationService.getLocations());
    } catch (error) {
        console.log(error);
        next(error);
    }
});

module.exports = router;