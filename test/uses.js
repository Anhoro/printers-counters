const expect = require('chai').expect;

const usersService = require('../services/users');

describe('services/users.js', function() {
    it('should generate a password with legnth of 8 with [A,a,-,7]', function() {
        const regExp = /(?=.*-)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
        const { password } = usersService.getGeneratedPassword();
        
        expect(regExp.test(password)).to.be.true;
    });
});