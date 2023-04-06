const express = require('express');
const path = require('path');

const rootDir = require('../helper').getRootDir();
const db = require('../services/db');

const router = express.Router();

/* GET / */
router.get('/', async function(req, res, next) {
    try {
        res.sendFile(path.join(rootDir, 'public', 'index.html'));
    } catch (err) {
        console.log('Error while getting printers-counters back-end webpage. ', err.message);
        next(err);
    }
});

/* GET /connection */
router.get('/connection', function (req, res, next) {
    try {
        res.json(db.getInfoConnection());
    } catch (err) {
        //res.json(err);
        console.log('Error while getting info about a db connection. ', err.message);
        next(err);
    }
});

/* POST /connection */
router.post('/connection', async function(req, res, next) {
    try {
        const connectionStatus = await db.establishConnection(req.body);

        if (connectionStatus.code === 'SUCCESS') {
            res.json(connectionStatus);
        } else {
            res.status(400).json(connectionStatus);
        }
    } catch (err) {
        console.log('Error while establshing connection to the database ', err.message);
        next(err);
    }
});

module.exports = router;