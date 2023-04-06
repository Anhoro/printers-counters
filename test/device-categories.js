const expect = require('chai').expect;
/*const sinon = require('sinon'); //tmp */

const config = require('../config');
const deviceCategoriesService = require('../services/device-categories');

let manufacturers;
let manufacturersModels;

describe('services/device-categories', function() {
    before(function() {
        config.db.database = "test-printers-counters";
    });

    it('should get manufacturers list from the DB', async function() {
        manufacturers = await deviceCategoriesService.getManufacturers();

        expect(manufacturers.data.length).to.not.equal(0);
    });

    it('should check if the first manufacturer is \'HP\'', async function() {
        const firstManufacturer = 'HP';

        expect(manufacturers.data[0].title).to.equal(firstManufacturer);
    });

    
    it('should get HP manufacturers model list from the DB', async function() {
        const manufacturerId =  manufacturers.data[0].id;
        manufacturersModels = await deviceCategoriesService.getModel(manufacturerId);

        expect(manufacturersModels.data.length).to.not.equal(0);
        
    });

    it('should check if the first HP manufacturer model is \'m426\'', async function() {
        const firstManufacturerModel = 'm426';

        expect(manufacturersModels.data[0].title).to.equal(firstManufacturerModel);
    });

    after(function() {
        config.db.database = "printers-counters";
    });
});
