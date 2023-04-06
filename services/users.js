const db = require('./db');
const helper = require('../helper');
const jwt = require('jsonwebtoken');

/* GET api/users/ */
/* get users info from a DB */
async function getMultipleUsers() {
    const rows = await db.query(
       `SELECT u.id, u.first_name, u.last_name, u.login, 
               u.role_id, r.title as 'role_title',
               u.location_id, lc.title as 'location_title'
        FROM users as u
        INNER JOIN users_roles as r
        ON u.role_id = r.id
        INNER JOIN location_categories as lc
        ON u.location_id = lc.id`);

    let data = helper.emptyArrOrRows(rows);

    data = data.map((item) => {
        return preparedUser(item);
    });

    return { data };
}

/* prepare device fields which were selected from DB in a more structured way */
function preparedUser(item) {
    const role = {
        id: item.role_id,
        title: item.role_title
    }

    const location = {
        id: item.location_id,
        title: item.location_title
    }

    const user = {
        id: item.id,
        firstName: item.first_name,
        lastName: item.last_name,
        login: item.login,
        role,
        location
    };

    return user;
}

/* POST api/users/ */
/* create user in a DB with hashed password */
async function createUser (user) {
    user.password = helper.hash(user.password);
    
    const result = await db.query(
        `INSERT INTO users (first_name, last_name, login, pass_hash, role_id, location_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
         [user.firstName, user.lastName, user.login, user.password, user.role.id, user.location.id]);
    
    let message = 'Error in creating user';

    if (result.affectedRows) {
        message = `User ${user.login} created successfully`;
    }

    return { message };
}

/* POST api/users/authenticate */
/* check user login and password in a DB and authenticate */
async function authenticateUser(user) {
    user.password = helper.hash(user.password);

    const rows = await db.query(
       `SELECT u.id, u.first_name, u.last_name, u.login,
        r.id as 'role_id', r.title as 'role_title', lc.title as location
        FROM users as u
        INNER JOIN users_roles as r
        ON u.role_id = r.id
        INNER JOIN location_categories as lc
        ON u.location_id = lc.id
        WHERE u.login = ? AND u.pass_hash = ?`,
        [user.login, user.password]
    );

    let message;
    let ifAuthenticated = false;
    let token;

    if (helper.emptyArrOrRows(rows).length != 0) {
        message = `User ${user.login} logged in successfully`;
        ifAuthenticated = true;

        token = jwt.sign(
            {
                id: rows[0].id,
                login: user.login,
                role_id: rows[0].role_id,
                location: rows[0].location
            },
            'secretKeyword4printersCountersApp',
            {
                expiresIn: '2h' //15s 1m 15m 30m 2h
            }
        );
    } else {
        const error = new Error ('Unknown user name or bad password');
        error.statusCode = 401;
        throw error;
    }

    return {
        message,
        token: token,
        ifAuthenticated
    };
}

/* GET api/users/login-unique */
/* get info about an availability of a login from a DB  */
async function checkLogin(userLogin) {
    const users = await getMultipleUsers();

    const searchedUser = users.data.find(user =>
        user.login === userLogin);

    let message = 'This login is already used';
    let ifUnique = false;

    if (searchedUser === undefined) {
        message = 'This login is unique';
        ifUnique = true;
    }

    return {
        message,
        ifUnique
    };
}

/* GET api/users/:id */
/* get info about a single user from a DB */
async function getSingleUser(id) {
    let rows = await db.query(
       `SELECT u.id, u.first_name, u.last_name, u.login, 
               u.role_id, r.title as 'role_title',
               u.location_id, lc.title as 'location_title'
        FROM users as u
        INNER JOIN users_roles as r
        ON u.role_id = r.id
        INNER JOIN location_categories as lc
        ON u.location_id = lc.id
        WHERE u.id = ?`, [id]);

    rows = preparedUser(rows[0]);
    
    return {
        data: rows
    }
}

/* PUT api/users/:id */
/* edit info of a user from a DB  */
async function updateUser(id, user) {
    let sql = `UPDATE users
               SET first_name = ?, last_name = ?, login = ?, location_id = ?, role_id = ?`;
    let params = [user.firstName, user.lastName, user.login, user.location.id, user.role.id];

    //if password === null then update all user data without password
    //else update user's password too
    if (user.password !== null) {
        sql += ', pass_hash = ?';
        user.password = helper.hash(user.password);
        params.push(user.password);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    const result = await db.query(sql, params);

    let message = 'Error in editing user \'' + user.login + '\'';

    if (result.affectedRows) {
        message = 'User \'' + user.login + '\' edited successfully';
    }

    return {message};
}

/* PUT api/users/:id?resetPassword=true */
/* reset, generate a new password and apply changes for a user from a DB  */
//req.query.resetPassword
async function changeUserPassword(id, user) {
    /*
        technically, this function consists of these two:
        getGeneratedPassword();
        updateUser();
    */

    /*
    const result = await db.query(
       `UPDATE users
        SET first_name = ?, last_name = ?, login = ?, location_id = ?, role_id = ?
        WHERE id = ?`,
        [user.firstName, user.lastName, user.login, user.location.id, user.role.id, id]
    );

    let message = 'Error in editing user \'' + user.login + '\'';

    if (result.affectedRows) {
        message = 'User \'' + user.login + '\' edited successfully';
    }

    return {message};*/
}

/* DELETE api/users/:id */
/* delete user from a DB  */
async function removeUser(id) {
    const result = await db.query(
       `DELETE FROM users
        WHERE id = ?`,
        [id]
    );

    let message = 'Error in deleting user with ID=' + id;

    if (result.affectedRows) {
        message = 'User with ID=' + id + ' deleted successfully';
    }

    return {message};
}

/* GET api/users/generated-password */
/* server-side genererated password  */
function getGeneratedPassword() {
    const password = helper.generatePassword();

    return { password };
}

module.exports = {
    authenticateUser,
    checkLogin,
    createUser,
    getGeneratedPassword,
    getMultipleUsers,
    getSingleUser,
    removeUser,
    updateUser
};