const express = require('express');

const usersLocationsService = require('../services/users-locations');

const router = express.Router();

/* GET api/users-locations */
router.get('/', async function(req, res, next) {
    try {
        res.json(await usersLocationsService.getUsersLocations());
    } catch (err) {
        console.log('Error while getting users-locations list. ', err.message);
        next(err);
    }
});

module.exports = router;