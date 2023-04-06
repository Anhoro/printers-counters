const expect = require('chai').expect;
/*const sinon = require('sinon'); //tmp */

const config = require('../config');
const usersService = require('../services/users');

let users;
let newUser = {
    'user-firstname': 'Mykola',
    'user-lastname': 'Mykolaienko',
    'user-login': 'p.almorzarzo',
    'user-password': 'lala',
    'user-role': 'user'
};
let userCredentials = {
    login: '',
    password: ''
}

describe('CRUD user', function() {
    before(function() {
        config.db.database = "test-printers-counters";
    });

    it('should get users list from the DB', async function() {
        users = await usersService.getMultipleUsers();

        expect(users.data.length).to.not.equal(0);
    });

    it('should fail unique login check in te DB', async function() {
        const res = await usersService.checkLogin(newUser['user-login']);
        const expectedMessage = 'This login is already used';

        expect(res.message).to.equal(expectedMessage);
    });
/*
    it('should success unique login check in te DB', async function() {
        newUser['user-login'] = 'm.mykolaienko';
        const res = await usersService.checkLogin(newUser['user-login']);
        const expectedMessage = 'This login is unique';

        expect(res.message).to.equal(expectedMessage);
    });*/

    it('should add a new user in te DB', async function() {
        const res = await usersService.createUser(newUser);
        const expectedMessage = `User ${newUser['user-login']} created successfully`;

        expect(res.message).to.equal(expectedMessage);
    });

    it('should not allow to log in a new user with a wrong password', async function() {
        userCredentials.login = newUser['user-login']
        userCredentials.password = 'wrong_password';
        
        const res = await usersService.authenticateUser(userCredentials);
        const expectedMessage = 'Unknown user name or bad password';
        
        expect(res.message).to.equal(expectedMessage);
    });
    
    it('should allow to log in a new user', async function() {
        userCredentials.password = 'lala';

        const res = await usersService.authenticateUser(userCredentials);
        const expectedMessage = `User ${userCredentials.login} logged in successfully`;

        expect(res.message).to.equal(expectedMessage);
    });

    after(function() {
        config.db.database = "printers-counters";
    });
});

/*
    authenticateUser,
    checkLogin,
    createUser,
    getMultipleUsers
*/
