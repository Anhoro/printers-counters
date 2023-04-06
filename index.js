const express = require('express');
const path = require('path');

const rootDir = require('./helper').getRootDir();
const config = require('./config');

const devicesRouter = require('./routes/devices');
const deviceCategoriesRouter = require('./routes/device-categories');
const locationCategoriesRouter = require('./routes/location-categories');
const usersLocationsRouter = require('./routes/users-locations');
const usersRolesRouter = require('./routes/users-roles');
const countersRouter = require('./routes/counters');
const consumableRouter = require('./routes/consumable');
const usersRouter = require('./routes/users');
const homeRouter = require('./routes/home');
const reportsRouter = require('./routes/downloadable-reports');
const devicesService = require('./services/devices'); //temp

const app = express();
const port = 3000;

app.use(express.json());

/*  true:    qs-lib,            person[name]=bobby&..., '?a'='b'
 *  false:   queryString-lib,   not                       a ='b'
 *
 *  I tried GET http://localhost:3000/api/printers-counters?page=3&permissions[view]=true
 *  but the results are the same (true/false/commented_out)
 *  some says that it is used in POST and PUT, not in GET or DELETE (I guess, because you do not use any parameters
 *  there, but I tried though)
 *  update: it says POST in http forms.
 *  https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
 *  didn-t read, ultra short: https://dev.to/griffitp12/express-s-json-and-urlencoded-explained-1m7o */
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(path.join(rootDir, 'public')));

app.use(function(req, res, next) {
    /* usecurely, but it works 100%
     * res.header("Access-Control-Allow-Origin", "*"); */
    /* update to match the domain you will make the request from (http://192.168.1.103 etc...)*/
    /* res.header("Access-Control-Allow-Origin", "http://localhost:4200"); //works 100% */
    /* works fine without OPTIONS though... because OPTIONS is used in 'complex' requests */
    /* res.header("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE"); //works 100% */
    /* res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); //works 100% */
    
    /* update to match the domain(s) you will make the request from (http://192.168.1.103 etc...)
     * ah, edit: domains of back and front end servers */
    const allowedDomains = [
        'http://localhost:4200',
        'http://192.168.1.153'
    ];
    const reqOrigin = req.headers.origin;
    
    if (allowedDomains.indexOf(reqOrigin) > -1) {
        res.header({
            'Access-Control-Allow-Origin': reqOrigin,
            'Access-Control-Allow-Methods': 'OPTIONS, GET, PUT, POST, DELETE',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      });
    }

    next();
});

//devicesService.updateMultipleDeviceConsumables();

app.use('/', homeRouter);
app.use('/api/users', usersRouter);
app.use('/api/counters', countersRouter);
app.use('/api/consumable', consumableRouter);
app.use('/api/devices', devicesRouter);
app.use('/api/device-categories', deviceCategoriesRouter);
app.use('/api/location-categories', locationCategoriesRouter);
app.use('/api/users-locations', usersLocationsRouter);
app.use('/api/users-roles', usersRolesRouter);
app.use('/api/reports', reportsRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.log('\x1b[41m\x1b[37mError:\x1b[0m ' + err.message, '\n', err.stack);
    res.status(statusCode).json({message: err.message});
    return;
});

app.listen(port, () => {
    /* initialize start time, used in static html file, otherwise it will be NaN */
    config.connectionDB.sessionStart = new Date();
    console.log(`\x1b[42mPrinters-counters\x1b[0m back-end app listening at localhost:\x1b[32m${port}\x1b[0m`);
});
