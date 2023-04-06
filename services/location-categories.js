const db = require('../services/db');
const helper = require('../helper');

/* GET api/location-categories */
/* get locations info from a DB */
async function getLocations() {
    const rows = await db.query(
       `SELECT lc.id, lc.title
        FROM location_categories AS lc`
    );
    
    const data = helper.emptyArrOrRows(rows);

    return {
        data
    }
}

module.exports = {
    getLocations
}