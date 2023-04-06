const express = require('express');

const reportsService = require('../services/downloadable-reports');
const isAuth = require('../services/is-auth');

const router = express.Router();

/* GET api/reports/ */
//    isAuth.getAccessWIthToken, 
router.get('/', 
    async function(req, res, next) {
        try {
            reportsService.getReportsList((err, dirReportsNamesArr) => {
                if (err !== null) {
                    throw new Error('Error while getting a list of reports.');
                }

                res.json(dirReportsNamesArr);
            })
        } catch (err) {
            console.log(err.message);
            next(err);
        }
});

/* POST api/reports/ */
//isAuth.getAccessWIthToken,
//isAuth.getAccessMinRole2,
router.post('/',
    async function(req, res, next) {
        try {
            const devices = req.body.devices;
            const filename = req.body.filename;

            reportsService.createReport(res, devices, filename);
        } catch (err) {
            console.log('Error while creating a report. ', err.message);
            next(err);
        }
});

/* GET api/reports/:filename */
//isAuth.getAccessWIthToken,
router.get('/:filename',
    async function(req, res, next) {
        try {
            reportsService.getReport(res, req.params.filename); //download test file

            //res.json(await devicesService.getSingleDevice(req.params.id));
        } catch (err) {
            console.log('Error while getting a report. ', err.message);
            next(err);
        }
});

/* DELETE api/reports/:filename */
//isAuth.getAccessWIthToken,
//isAuth.getDeviceInfo,
//isAuth.getAccessMinRole2,
router.delete('/:filename',
    async function(req, res, next) {
        try {
            reportsService.deleteReport(req.params.filename, (err) => {
                if (err !== null) {
                    throw new Error('Error while deleting a report.');
                }
                
                console.log('File succesfully removed')
                const message = 'File succesfully removed';
                res.json({ message });
            })
            //res.json(await devicesService.remove(req.params.id));
        } catch (err) {
            //console.log('', err.message);
            next(err);
        }
});

module.exports = router;