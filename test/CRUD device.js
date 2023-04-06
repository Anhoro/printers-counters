const expect = require('chai').expect;
/*const sinon = require('sinon'); //tmp */

const config = require('../config');
const devicesService = require('../services/devices');

let newDevice;

describe('CRUD device', function() {
    before(function() {
        config.db.database = "test-printers-counters";
    });

    it('should add a new device to the DB', async function() {
        newDevice = {
            id: -1,
            title: 'test hp m428 (903k konst)',
            url: 'test localhost 90.11.16.108',
            ip: '90.11.16.108',
            countersAll: 0,
            manufacturer: {
                brand: {
                    id: 2,
                    title: 'HP'
                },
                model: {
                    id: 4,
                    title: 'm402',
                    countersKeywords: 'лала;pepe2'
                }
            }
        };

        const res = await devicesService.create(newDevice);
        newDevice.id = res.id;
        
        expect(newDevice.id).to.not.equal(-1);
    });

    it('should get that new device from the DB', async function() {
        const createdDevice = await devicesService.getSingleDevice(newDevice.id);

        expect(createdDevice.data.title).to.equal(newDevice.title);
    });

    it('should edit that new device in the DB', async function() {
        newDevice.title = 'test hp m428 (1903k konst)';

        const res = await devicesService.update(newDevice.id, newDevice);
        const expectedMessage = 'Device \'' + newDevice.title + '\' edited successfully';
        expect(res.message).to.equal(expectedMessage);
    });

    it('should get that new edited device from the DB', async function() {
        const editedDevice = await devicesService.getSingleDevice(newDevice.id);

        expect(editedDevice.data.title).to.equal(newDevice.title);
    });
    
    it('should delete that new device from the DB', async function() {
        const res = await devicesService.remove(newDevice.id);
        const expectedMessage = 'Device with ID=' + newDevice.id + ' deleted successfully';

        expect(res.message).to.equal(expectedMessage);
    });

    after(function() {
        config.db.database = "printers-counters";
    });
});


/*
    //testing order of tests

let x = 0;

function fetchValue(plusValue, delay) {
    return new Promise(function(resolve, reject) {
        setTimeout(() => {
            x = x + plusValue;
            resolve(x);
        }, delay);
    });
}

    it('should be done first', async function() {
        const res = await fetchValue(2, 3000);

        console.log(res);
        expect(x).to.equal(2);

        // fetchValue(2, 3000)
        //     .then((res) => {
        //         console.log(res);
        //         expect(x).to.equal(2);
        //         done();
        //     });
    });

    it('should be done second', async function() {
        const res = await fetchValue(4, 1000);

        console.log(res);
        expect(x).to.equal(6);
        // fetchValue(4, 200)
        //     .then((res) => {
        //         console.log(res);
        //         expect(x).to.equal(6);
        //         done();
        //     });
    });

    it('should be done third', async function() {
        const res = await fetchValue(10, 2000);

        console.log(res);
        expect(x).to.equal(16);
        // fetchValue(10, 300)
        //     .then((res) => {
        //         console.log(res);
        //         expect(x).to.equal(16);
        //         done();
        //     });
    });
*/