const jwt = require('jsonwebtoken');

const devicesService = require('./devices');

function getAccessWIthToken(req, res, next) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error ('Not authenticated');
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, 'secretKeyword4printersCountersApp')
    } catch (err) {
        throw err;
    }

    if (!decodedToken) {
        const error = new Error ('Not authenticated, !decodedToken');
        error.statusCode = 401;
        throw error;
    }

    req.authenticatedUser = {
        id: decodedToken.id,
        roleId: +decodedToken.role_id,
        locationTitle: decodedToken.location
    }

    console.log('req.authenticatedUser');
    console.log(req.authenticatedUser);

    next();
}

function getAccessMinRole2 (req, res, next) {
    const userLocation = req.authenticatedUser.locationTitle;
    const roleId = req.authenticatedUser.roleId;
    const device = req.body;

    console.log('req.authenticatedUser');
    console.log(req.authenticatedUser);

    console.log('device in auth');
    console.log(device);

    if (roleId === 1) return next();

    if ((roleId === 2) && 
        ((device.location.title === 'HO') || (device.location.title === 'RC'))) {
        return next();
    }

    if ((roleId === 3) && 
        ((device.location.title === userLocation) || (device.location.title === 'RC'))) {
        return next();
    }

    const error = new Error ('You do not have sufficient rights to perform this operation');
    error.statusCode = 401;
    throw error;
}

function getAccessOnlyRole3 (req, res, next) {
    const roleId = req.authenticatedUser.roleId;

    console.log('roleId');
    console.log(roleId);

    if (roleId === 1) return next();
    
    const error = new Error ('You do not have sufficient rights to perform this operation');
    error.statusCode = 401;
    throw error;
}

async function getDeviceInfo(req, res, next) {
    const device = (await devicesService.getSingleDevice(req.params.id)).data;

    console.log('device');
    console.log(device);

    req.body = device;

    next();
}

module.exports = {
    getAccessWIthToken,
    getAccessMinRole2,
    getAccessOnlyRole3,
    getDeviceInfo
}