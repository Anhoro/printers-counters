const express = require('express');

const usersRolesService = require('../services/users-roles');

const router = express.Router();

/* GET api/users-roles */
router.get('/', async function(req, res, next) {
    try {
        res.json(await usersRolesService.getUsersRoles());
    } catch (err) {
        console.log('Error while getting users-roles list. ', err.message);
        next(err);
    }
});

module.exports = router;