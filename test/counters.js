const expect = require('chai').expect;
/*const sinon = require('sinon'); //tmp */

const config = require('../config');
const devicesService = require('../services/devices');
const countersService = require('../services/counters');

let devices;

describe('services/counters', function() {
    before(function() {
        config.db.database = "test-printers-counters";
    });

    it('should get devices list from the DB', async function() {
        devices = await devicesService.getMultipleDevices();

        expect(devices.data.length).to.not.equal(0);
    });

    it('should update counters for the first device element of the DB', async function() {
        const firstDevice = devices.data[0];
        
        const res = await devicesService.updateSingleDeviceCounters(firstDevice.id, firstDevice);
        const expectedMessage = 'Counter for a device №' + firstDevice.id + ' edited successfully';

        expect(res.message).to.equal(expectedMessage);
    });

    it('should try to update counters for all devices of the DB', async function() {
        const res = await devicesService.updateMultipleDeviceCounters();

        expect(res.length).to.equal(devices.data.length);
    });

    after(function() {
        config.db.database = "printers-counters";
    });
});
