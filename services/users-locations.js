const db = require('./db');
const helper = require('../helper');

/* GET api/users-locations */
/* get users locations info from a DB */
async function getUsersLocations() {
    const rows = await db.query(
       `SELECT id, title
        FROM location_categories`);

    const data = helper.emptyArrOrRows(rows);

    return {
        data
    };
}

module.exports = {
    getUsersLocations
};