const mysql = require('mysql2/promise');

const config = require('../config');

/* create one-time connection to the DB and execute SQL query */
async function query(sql, params) {
    try {
        const connection = await mysql.createConnection(config.db);
        
        const [results] = await connection.execute(sql, params);
        connection.end(function(err) {
            console.log('Error during closing conection to DB after query.');
        });

        return results;
    } catch (err) {
        console.log('cought error');
        console.log(err);
        throw new Error('haha ' + err.message);
    }
}

/* POST /connection */
/* edit DB credentials and save them */
async function establishConnection(reqBody) {
    const credentialsDB = {
        host: reqBody['db-url'],
        user: reqBody['user-login'],
        password: reqBody['user-password'],
        database: reqBody['db-title']
    };

    try {
        config.db = {...credentialsDB};
        config.connectionDB.sessionStart = reqBody['sessionStart'];
        
        res = await mysql.createConnection(credentialsDB);
        
        return {
            message: 'Connection to the DB was established!',
            code: "SUCCESS" //temp
        };
    } catch (err) {
        console.log('Could not establish connection to the DB. ', err.message);
        return err;
    }
}

/* GET /connection */
/* get DB credentials info */
function getInfoConnection() {
    try {
        const res = {
            database: config.db.database,
            sessionStart: config.connectionDB.sessionStart
        };

        return res;
    } catch (err) {
        console.log('Could not get info about connection to the DB. ', err.message);
        return err;
    }
}

module.exports = {
    establishConnection,
    getInfoConnection,
    query
}
