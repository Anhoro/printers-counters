const db = require('./db');
const helper = require('../helper');

/* GET api/users-roles */
/* get users roles info from a DB */
async function getUsersRoles() {
    const rows = await db.query(
       `SELECT id, title
        FROM users_roles`);

    const data = helper.emptyArrOrRows(rows);

    return {
        data
    };
}

module.exports = {
    getUsersRoles
};