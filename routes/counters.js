const express = require('express');

const devicesService = require('../services/devices');
const devicesCategories = require('../services/device-categories');

const router = express.Router();

/* PUT api/counters/ */
router.put('/', async function(req, res, next) {
    try {
        res.json(await devicesService.updateMultipleDeviceCounters());
    } catch (err) {
        console.log('Error while updating all counters. ', err.message);
        next(err);
    }
});

/* GET api/counters/:id */
router.get('/:id', async function(req, res, next) {
    try {
        res.json(await devicesService.getSingleDevice(req.params.id));
    } catch (err) {
        console.log('Error while getting counter. ', err.message);
        next(err);
    }
});

/* PUT api/counters/:id */
router.put('/:id', async function(req, res, next) {
    try {
        res.json(await devicesService.updateSingleDeviceCounters(req.params.id, req.body));
    } catch (err) {
        console.log('Error while updating counter. ', err.message);
        next(err);
    }
});

/* PUT api/counters/keywords/:id */
router.put('/keywords/:id', async function(req, res, next) {
    try {
        res.json(await devicesCategories.updateCounterKeywords(req.params.id, req.body['countersKeywords']));
    } catch (err) {
        console.log('Error while updating counter keyword. ', err.message);
        next(err);
    }
});

module.exports = router;