const express = require('express');

const devicesService = require('../services/devices');
//const devicesCategories = require('../services/device-categories');

const router = express.Router();

/* PUT api/consumable/ */
router.put('/', async function(req, res, next) {
    try {
        //res.json({message: 'successful test'});
        res.json(await devicesService.updateMultipleDeviceConsumable());
        //res.json(await devicesService.updateMultipleDeviceCounters());
    } catch (err) {
        console.log('Error while updating all consumable. ', err.message);
        next(err);
    }
});

/* GET api/consumable/:id */
router.get('/:id', async function(req, res, next) {
    try {

        // ??
        //res.json(await devicesService.getSingleDevice(req.params.id));
    } catch (err) {
        console.log('Error while getting consumable. ', err.message);
        next(err);
    }
});

/* PUT api/consumable/:id */
router.put('/:id', async function(req, res, next) {
    try {
        res.json({ message: 'successful test 2'});
        //res.json(await devicesService.updateSingleDeviceConsumable(req.params.id, req.body));
        //res.json(await devicesService.updateSingleDeviceCounters(req.params.id, req.body));
    } catch (err) {
        console.log('Error while updating consumable. ', err.message);
        next(err);
    }
});

/* PUT api/consumable/keywords/:id */
router.put('/keywords/:id', async function(req, res, next) {
    try {
        res.json(await devicesCategories.updateConsumableKeywords(req.params.id, req.body['consumableKeywords']));
    } catch (err) {
        console.log('Error while updating consumable keyword. ', err.message);
        next(err);
    }
});

module.exports = router;