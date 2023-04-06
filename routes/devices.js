const express = require('express');

const devicesService = require('../services/devices');
const devicesCategories = require('../services/device-categories');
const isAuth = require('../services/is-auth');

const router = express.Router();

/* GET api/devices/ */
router.get('/', 
    isAuth.getAccessWIthToken, 
    async function(req, res, next) {
        try {
            res.json(await devicesService.getMultipleDevices(req.query.page));
        } catch (err) {
            console.log('Error while getting device list. ', err.message);
            next(err);
        }
});

/* POST api/devices/ */
router.post('/',
    isAuth.getAccessWIthToken,
    isAuth.getAccessMinRole2,
    async function(req, res, next) {
        try {
            await devicesCategories.updateCounterKeywords(req.body.manufacturer.model.id, req.body.manufacturer.model.countersKeywords);
            res.json(await devicesService.create(req.body));
        } catch (err) {
            console.log('Error while creating device. ', err.message);
            next(err);
        }
});

/* GET api/devices/:id */
router.get('/:id',
    isAuth.getAccessWIthToken,
    async function(req, res, next) {
        try {
            res.json(await devicesService.getSingleDevice(req.params.id));
        } catch (err) {
            console.log('Error while getting a device № ' + req.params.id + '. ', err.message);
            next(err);
        }
});

/* PUT api/devices/:id */
router.put('/:id',
    isAuth.getAccessWIthToken,
    isAuth.getAccessMinRole2,
    async function(req, res, next) {
        try {
            await devicesCategories.updateCounterKeywords(req.body.manufacturer.model.id, req.body.manufacturer.model.countersKeywords);
            res.json(await devicesService.update(req.params.id, req.body));
        } catch (err) {
            console.log('Error while editing device. ', err.message);
            next(err);
        }
});

/* DELETE api/devices/:id */
router.delete('/:id',
    isAuth.getAccessWIthToken,
    isAuth.getDeviceInfo,
    isAuth.getAccessMinRole2,
    async function(req, res, next) {
        try {
            res.json(await devicesService.remove(req.params.id));
        } catch (err) {
            console.log('Error while deleting device. ', err.message);
            next(err);
        }
});

module.exports = router;