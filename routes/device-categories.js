const express = require('express');

const deviceCategoriesService = require('../services/device-categories');

const router = express.Router();

/* GET api/device-categories/manufacturers */
router.get('/manufacturers', async function(req, res, next) {
    try {
        res.json(await deviceCategoriesService.getManufacturers());
    } catch (err) {
        console.log('Error while getting device-categories list. ', err.message);
        next(err);
    }
});

/* GET api/device-categories/manufacturers-models/:id */
router.get('/manufacturers-models/:id', async function(req, res, next) {
    try {
        res.json(await deviceCategoriesService.getModel(req.params.id));
    } catch (err) {
        console.log('Error while getting device-model of this manufacturer. ', err.message);
        next(err);
    }
});

module.exports = router;