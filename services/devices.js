const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const countersService = require('../services/counters');
const deviceCategoriesService = require('../services/device-categories');

/* GET api/devices */
/* get devices info from a DB, using pagination */
async function getMultipleDevices(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
       `SELECT d.id, d.title, d.url, d.ip, d.counters_all as countersAll,
               d.url_consumable as urlCons, d.toner, d.drum, d.waste, d.clean,
               dcm.modelId, dcm.modelTitle, dcm.countersKeywords,
               dcm.manufacturerId, dcm.manufacturerTitle,
               lc.id AS location_id, lc.title AS location_title
        FROM devices AS d
        LEFT JOIN
           (SELECT parent.id AS manufacturerId, parent.title AS manufacturerTitle, 
                   node.id AS modelId, node.title AS modelTitle, node.counter_keyword AS countersKeywords
            FROM device_categories AS node,
                 device_categories AS parent
            WHERE node.lft BETWEEN parent.lft AND parent.rgt
              AND parent.id != 1
              AND parent.id != node.id
            ORDER BY parent.lft) AS dcm
        ON d.model_id = dcm.modelId
        LEFT JOIN location_categories AS lc
        ON d.location_id = lc.id
        LIMIT ?, ?`,
        [offset + '', config.listPerPage + '']
    );
    
    let data = helper.emptyArrOrRows(rows);
    
    data = data.map((item) => {
        return preparedDevice(item);
    });

    const meta = {page};

    return {
        data,
        meta
    }
};

/* prepare device fields which were selected from DB in a more structured way */
function preparedDevice(item) {
    const brand = {
        id: item.manufacturerId,
        title: item.manufacturerTitle
    };

    const model = {
        id: item.modelId,
        title: item.modelTitle,
        countersKeywords: item.countersKeywords
    }
    const manufacturer = {
        brand,
        model
    };

    const location = {
        id: item.location_id,
        title: item.location_title
    }

    const device = {
        id: item.id,
        title: item.title,
        url: item.url,
        urlCons: item.urlCons,
        ip: item.ip,
        countersAll: item.countersAll,
        toner: item.toner,
        drum: item.drum,
        waste: item.waste,
        clean: item.clean,
        manufacturer,
        location
    };

    return device;
}

/* PUT api/counters/:id */
/* fetch counters data from a single website and update DB */
async function updateSingleDeviceCounters(id, device) {
    const counterOrMessage = await countersService.getCounterFromWebsite(device.url, device.manufacturer.model.countersKeywords);
    const res = await updateCounter(id, counterOrMessage);

    return res;
}

/* PUT api/counters/ */
/* fetch counters data from all websites and update DB */
async function updateMultipleDeviceCounters() {
    const fetchedData = await getMultipleDevices();
    const devices = fetchedData.data;
    const devicesCountersPromises = [];

    /* fetch counters from MFPs webservers */
    for (let i = 0; i < devices.length; i++) {
        devicesCountersPromises.push(countersService.getCounterFromWebsite(devices[i].url, devices[i].manufacturer.model.countersKeywords));
    }

    const updatedCounters = await Promise.all(devicesCountersPromises);
    
    /* update counters in the DB */
    for (let i = 0; i < updatedCounters.length; i++) {
        devicesCountersPromises[i] = updateCounter(devices[i].id, updatedCounters[i]);
    }

    return await Promise.all(devicesCountersPromises);
}

/* PUT api/consumables/:id */
/* fetch consumables data from a single website and update DB */
async function updateSingleDeviceConsumable(id, device) {
    //const counterOrMessage = await countersService.getCounterFromWebsite(device.url, device.manufacturer.model.countersKeywords);
    //const res = await updateCounter(id, counterOrMessage);

    return res;
}

/* PUT api/consumables / */
/* fetch consumables data (xerox) from all websites and update DB */
async function updateMultipleDeviceConsumable() {
    //mock fetchedDevices
    /*const fetchedDevices = [
        {
            id: 4,
            title: "hp m426 (2 floor)",
            url: "http://localhost:8080/hp%20m426/HP%20LaserJet%20MFP%20M426dw%C2%A0%C2%A0%C2%A010.11.9.171.html",
            ip: "10.11.16.103",
            countersAll: 20237,
            manufacturer: {
                brand: {
                    id: 2,
                    title: "HP"
                },
                model: {
                    id: 3,
                    title: "m426",
                    countersKeywords: "Всего оттисков",
                    tonerKeywords: "",
                    drumKeywords: "",
                    wasteKeywords: "",
                    cleanKeywords: "",
                }
            },
            location: {
                id: 3,
                title: "F4"
            },
            url_consumables: "url1",
            toner: 0,
            drum: 0,
            waste: 0,
            clean: 0
        },
        {
            id: 17,
            title: "xerox 5335 (7 floor)",
            url: "http://localhost:8080/Xerox%20WorkCentre%205335%20-%2010.11.9.178.html",
            ip: "10.11.9.178",
            countersAll: 0,
            manufacturer: {
                brand: {
                    id: 7,
                    title: "XEROX"
                },
                model: {
                    id: 8,
                    title: "3225",
                    countersKeywords: "Всего отпечатков",
                    tonerKeywords: "Черный принт-картридж;Xerox Black Print Cartridge",
                    drumKeywords: "Black Imaging Unit",
                    wasteKeywords: "",
                    cleanKeywords: "",
                }
            },
            location: {
                id: 1,
                title: "HO"
            },
            url_consumable: "http://localhost:8080/Consumables.html",
            toner: 0,
            drum: 0,
            waste: 0,
            clean: 0
        },
        {
            id: 18,
            title: "xerox d95 operator",
            url: "http://localhost:8080/Xerox%20WorkCentre%205335%20-%2010.11.9.178.html",
            ip: "10.11.9.178",
            countersAll: 0,
            manufacturer: {
                brand: {
                    id: 7,
                    title: "XEROX"
                },
                model: {
                    id: 9,
                    title: "d95",
                    countersKeywords: "Всего отпечатков",
                    tonerKeywords: "Черный тонер",//Черный тонер
                    drumKeywords: "Принт-картридж (черный)",
                    wasteKeywords: "small>Сборник отработанного тонера",
                    cleanKeywords: "Clean cartridge;Чистящий картридж",
                }
            },
            location: {
                id: 1,
                title: "HO"
            },
            url_consumable: "http://localhost:8080/Consumables.html",
            toner: 0,
            drum: 0,
            waste: 0,
            clean: 0
        }
    ];

    const devices = fetchedDevices.filter((device) => {
        return device.manufacturer.brand.title === 'XEROX';
    });*/

    //const fetchedData = await getMultipleDevices();

    /* search for consumables only on a XEROX webpages */
    //const devices = fetchedData.data.filter...



    const devicesConsumablePromises = [];
    let deviceConsArr;
    
    

    const fetchedDevicesRes = await getMultipleDevices();

    const devices = fetchedDevicesRes.data.filter((device) => {
        //return (device.id === 108);
        //return (device.id === 109);
        return ((device.id === 108) || (device.id === 109));
        //return (device.id === 107);
        //return ((device.id === 106) || (device.id === 107));
    });
    
    const fetchedModelsRes = await deviceCategoriesService.getModel(7);

    /*fetchedDevicessss.forEach((device) => {
        console.log(device);
    });*/

    //return fetchedModelsRes.data;

    /* fetch consumables from MFPs (xerox) webservers */
    //for (let i = 0; i < devices.length; i++) {
        //todo: 
        //well, we need url and keyword - no, array of keywords, or obj
        //countersService.getConsumablesFromWebsite(devices[i].url, devices[i].manufacturer.model.consumablewKeywords...)
        //countersService.getCounterFromWebsite(devices[i].url, devices[i].manufacturer.model.countersKeywords)
        //devicesConsumablesPromises.push();
    //}

    //const updatedConsumables = await Promise.all(devicesConsumablesPromises);

    /* fetch consumable from MFPs webservers */
    //for (let i = 0; i < devices.length; i++) {
    //    devicesConsumablePromises.push(countersService.getConsumableFromWebsite(devices[i], deviceConsArr[i]));
    //}

    //const updatedCounters = await Promise.all(devicesCountersPromises);

    devices.forEach((device) => {
    
        /* helper array that uses the device consumable info */
        deviceConsArr = [
            {
                attrName: 'tonerKeywords',
                keywords: '',
                value: 0
            },
            {
                attrName: 'drumKeywords',
                keywords: '',
                value: 0
            },
            {
                attrName: 'wasteKeywords',
                keywords: '',
                value: 0
            },
            {
                attrName: 'cleanKeywords',
                keywords: '',
                value: 0
            }  
        ];

        fetchedModelsRes.data.forEach((fetchedModel) => {
            if (fetchedModel.id === device.manufacturer.model.id) {
                /* if a device has keyword in the DB, than we beleive that it exists somewhere on a webpage,  
                   so we use it in our helper array */
                deviceConsArr.forEach((deviceConsItem) => {
                    if ((fetchedModel[deviceConsItem.attrName] !== null) &&
                        (fetchedModel[deviceConsItem.attrName] !== undefined) &&
                        (fetchedModel[deviceConsItem.attrName] !== '')) {
                        deviceConsItem.keywords = fetchedModel[deviceConsItem.attrName];
                    }
                });
            }
        });

        //devicesCountersPromises.push(countersService.getCounterFromWebsite(devices[i].url, devices[i].manufacturer.model.countersKeywords));

        console.log('device');
        console.log(device);
        //return device;

    devicesConsumablePromises.push(countersService.getConsumableFromWebsite(device, deviceConsArr));
    console.log('Promises:');
    console.log(devicesConsumablePromises);


    //const updatedConsumable = countersService.getConsumableFromWebsite(device, deviceConsArr);
    


    });

    

    const updatedConsumable = await Promise.all(devicesConsumablePromises);

    //return updatedConsumable;

    //return deviceConsArr;

    /*deviceConsArr.forEach((deviceConsItem) => {
        if ((device.manufacturer.model[deviceConsItem.attrName] !== null) &&
            (device.manufacturer.model[deviceConsItem.attrName] !== undefined) &&
            (device.manufacturer.model[deviceConsItem.attrName] !== '')) {
            deviceConsItem.keywords = device.manufacturer.model[deviceConsItem.attrName];
        }
    });*/

    /* todo delete
    console.log('deviceConsArr:');
    deviceConsArr.forEach((deviceConsItem) => {
        console.log(deviceConsItem.attrName + ' - ' + 
                    deviceConsItem.keywords + ' - ' + 
                    deviceConsItem.value)
    });*/


    let currentConsumable;

    for (let i = 0; i < devices.length; i++){
        for (let j = 0; j < updatedConsumable[i].length; j++) {
            currentConsumable = updatedConsumable[i][j].attrName.substr(0, updatedConsumable[i][j].attrName.length - 8);
            console.log(currentConsumable);
            devices[i][currentConsumable] = updatedConsumable[i][j].value;
        }
    }
    
    return devices;

    /*
        I guess I do not need this
        and use nice clean function to update only separate device attrs
        yes
        yes 
        yeeees!
        write another function updateCounter ---- updateConsumable, which will update
            only the toner, drum, waste, clean attributes by device.id!

        and make a nice structure for all xerox models, and .txt for explanation - where is 3225 etc
    */
    /*updatedConsumable.forEach((updConsumable, i) => {
        device[updConsumable.attrName.substr(0, updConsumable.attrName.length - 8)] = updConsumable.value;
    });*/

    

    


    /* update consumables in the DB */
    for (let i = 0; i < updatedConsumables.length; i++) {
        //todo:
        //updateConsumables(devices[i].id, updatedConsumables[i]);
        //updateCounter(devices[i].id, updatedCounters[i]);
        devicesConsumablesPromises[i] = '';
    }

    return await Promise.all(devicesConsumablesPromises);
}


/* GET api/counters/:id */
/* get a single device info from a DB */
async function getSingleDevice(id) {
    let rows = await db.query(
       `SELECT d.id, d.title, d.url, d.ip, d.counters_all as countersAll, 
               dcm.modelId, dcm.modelTitle, dcm.countersKeywords,
               dcm.manufacturerId, dcm.manufacturerTitle,
               lc.id AS location_id, lc.title AS location_title
        FROM devices AS d
        LEFT JOIN
           (SELECT parent.id AS manufacturerId, parent.title AS manufacturerTitle, 
                   node.id AS modelId, node.title AS modelTitle, node.counter_keyword AS countersKeywords
            FROM device_categories AS node,
                 device_categories AS parent
            WHERE node.lft BETWEEN parent.lft AND parent.rgt
              AND parent.id != 1
              AND parent.id != node.id
            ORDER BY parent.lft) AS dcm
        ON d.model_id = dcm.modelId
        LEFT JOIN location_categories AS lc
        ON d.location_id = lc.id
        WHERE d.id = ?`, [id]);

    rows = preparedDevice(rows[0]);
    
    return {
        data: rows
    }
}

/* POST api/devices/ */
/* create new device in the DB */
//added id of a newly created device to the result =============================== could be an error in Angular <message>
async function create(device) {
    const result = await db.query(
       `INSERT INTO devices (title, url, ip, model_id, counters_all, location_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [device.title, device.url, device.ip, device.manufacturer.model.id, device.countersAll, device.location.id]
    );

    let message = 'Error in creating device';
    let id = -1;

    if (result.affectedRows) {
        message = 'Device created successfully';
        id = result.insertId;
    }

    return {
        id,
        message
    };
}

/* PUT api/devices/:id */
/* edit device in the DB */
async function update(id, device) {
    const result = await db.query(
        `UPDATE devices
        SET title = ?, url = ?, ip = ?, model_id = ?, counters_all = ?, location_id = ?
        WHERE id = ?`,
        [device.title, device.url, device.ip, device.manufacturer.model.id, device.countersAll, device.location.id, id]
    );

    let message = 'Error in editing device \'' + device.title + '\'';

    if (result.affectedRows) {
        message = 'Device \'' + device.title + '\' edited successfully';
    }

    return {message};
}

/* update DB with a new counters data */
async function updateCounter(id, counter) {
    if (typeof(counter) !== 'number') {
        return {message: counter}
    }

    const result = await db.query(
        `UPDATE devices
        SET counters_all = ?
        WHERE id = ?`,
        [counter, id]
    );

    let message = 'Error in editing counter for a device №' + id;

    if (result.affectedRows) {
        message = 'Counter for a device №' + id + ' edited successfully';
    }

    return {message};
}

/* DELETE api/devices/:id */
/* delete device from a DB */
async function remove(id) {
    const result = await db.query(
        `DELETE FROM devices
        WHERE id = ?`,
        [id]
    );

    let message = 'Error in deleting device with ID=' + id;

    if (result.affectedRows) {
        message = 'Device with ID=' + id + ' deleted successfully';
    }

    return {message};
}

module.exports = {
    create,
    getMultipleDevices,
    getSingleDevice,
    remove,
    update,
    updateCounter,
    updateMultipleDeviceCounters,
    updateMultipleDeviceConsumable,
    updateSingleDeviceCounters
}