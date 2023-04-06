const expect = require('chai').expect;

const config = require('../config');
const devicesService = require('../services/devices');
const countersService = require('../services/counters');

let devices;
let updatedDevices = [
    {
        "id": 17,
        "title": "xerox 5335 (7 floor)",
        "url": "http://localhost:8080/Xerox%20WorkCentre%205335%20-%2010.11.9.178.html",
        "ip": "10.11.9.178",
        "countersAll": 0,
        "manufacturer": {
            "brand": {
                "id": 7,
                "title": "XEROX"
            },
            "model": {
                "id": 8,
                "title": "3225",
                "countersKeywords": "Всего отпечатков",
                "tonerKeywords": "Xerox Black Print Cartridge",
                "drumKeywords": "Black Imaging Unit",
                "wasteKeywords": "",
                "cleanKeywords": ""
            }
        },
        "location": {
            "id": 1,
            "title": "HO"
        },
        "url_consumable": "http://localhost:8080/Consumables.html",
        "toner": 94,
        "drum": 98,
        "waste": 0,
        "clean": 0
    },
    {
        "id": 18,
        "title": "xerox d95 operator",
        "url": "http://localhost:8080/Xerox%20WorkCentre%205335%20-%2010.11.9.178.html",
        "ip": "10.11.9.178",
        "countersAll": 0,
        "manufacturer": {
            "brand": {
                "id": 7,
                "title": "XEROX"
            },
            "model": {
                "id": 9,
                "title": "d95",
                "countersKeywords": "Всего отпечатков",
                "tonerKeywords": "Черный тонер",
                "drumKeywords": "Принт-картридж (черный)",
                "wasteKeywords": "small>Сборник отработанного тонера",
                "cleanKeywords": "Чистящий картридж"
            }
        },
        "location": {
            "id": 1,
            "title": "HO"
        },
        "url_consumable": "http://localhost:8080/Consumables.html",
        "toner": 11,
        "drum": 22,
        "waste": 33,
        "clean": 99
    }
];

describe('services/consumable', function() {
    before(function() {
        config.db.database = "test-printers-counters";
    });

    it('should try to update consumable for all devices of the DB', async function() {
        const res = await devicesService.updateMultipleDeviceConsumable();

        res.forEach((device, i) => {
            expect(device.toner).to.equal(updatedDevices[i].toner);
            expect(device.drum).to.equal(updatedDevices[i].drum);
            expect(device.waste).to.equal(updatedDevices[i].waste);
            expect(device.clean).to.equal(updatedDevices[i].clean);
        });
    });

    after(function() {
        config.db.database = "printers-counters";
    });
});
