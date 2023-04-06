const express = require('express');

const usersSerice = require('../services/users');
const isAuth = require('../services/is-auth');

const router = express.Router();

/* GET api/users/ */
router.get('/', 
    isAuth.getAccessWIthToken,
    async function(req, res, next) {
        try {
            res.json(await usersSerice.getMultipleUsers());
        } catch (err) {
            console.log('Error while getting users list. ', err.message);
            next(err);
        }
    }
);

/* POST api/users/ */
router.post('/',
    isAuth.getAccessWIthToken,
    isAuth.getAccessOnlyRole3,
    async (req, res, next) => {
        try {
            res.json(await usersSerice.createUser(req.body));
        } catch (err) {
            console.log('Error while creating user. ', err.message);
            next(err);
        }
    }
);

/* POST api/users/authenticate */
router.post('/authenticate', async (req, res, next) => {
    try {
        res.json(await usersSerice.authenticateUser(req.body));
    } catch (err) {
        console.log('Unknown user name or bad password');
        next(err);
    }
});

/* GET api/users/login-unique?login=p.almorzarzo */
router.get('/login-unique',
    isAuth.getAccessWIthToken,
    isAuth.getAccessOnlyRole3,
    async (req, res, next) => {
        try {
            res.json(await usersSerice.checkLogin(req.query.login));
        } catch (err) {
            console.log('An error occured during checking a login for uniqueness.');
            next(err);
        }
    }
);

/* GET api/users/generated-password */
router.get('/generated-password',
    isAuth.getAccessWIthToken,
    isAuth.getAccessOnlyRole3,
    (req, res, next) => {
        try {
            res.json(usersSerice.getGeneratedPassword());
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
);

/* GET api/users/:id */
router.get('/:id', 
    isAuth.getAccessWIthToken,
    async function(req, res, next) {
        try {
            res.json(await usersSerice.getSingleUser(req.params.id));
        } catch (err) {
            console.log('Error while getting a user № ' + req.params.id + '. ', err.message);
            next(err);
        }
    }
);

/* PUT api/users/:id  */
router.put('/:id', 
    isAuth.getAccessWIthToken,
    isAuth.getAccessOnlyRole3,
    async function(req, res, next) {
        try {
            res.json(await usersSerice.updateUser(req.params.id, req.body));
        } catch (err) {
            console.log('Error while updating a user № ' + req.params.id + '. ', err.message);
            next(err);
        }
    }
);

/* delete api/users/:id  */
router.delete('/:id',
    isAuth.getAccessWIthToken,
    isAuth.getAccessOnlyRole3,
    async (req, res, next) => {
        try {
            res.json(await usersSerice.removeUser(req.params.id));
        } catch (err) {
            console.log('Error while deleting user. ', err.message);
            next(err);
        }
    }
);

module.exports = router;