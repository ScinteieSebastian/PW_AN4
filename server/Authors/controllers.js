const express = require('express');

const AuthorsService = require('./services.js');

const {
    validateFields
} = require('../utils');
const {
    authorizeAndExtractToken
} = require('../security/Jwt');

const {
    authorizeRoles
} = require('../security/Roles');

const router = express.Router();

router.post('/', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        firstName,
        lastName
    } = req.body;

    // validare de campuri
    try {

        const fieldsToBeValidated = {
            firstName: {
                value: firstName,
                type: 'alpha'
            },
            lastName: {
                value: lastName,
                type: 'alpha'
            }
        };

        validateFields(fieldsToBeValidated);

        await AuthorsService.add(firstName, lastName);

        res.status(201).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/', authorizeAndExtractToken, authorizeRoles('admin', 'user'), async (req, res, next) => {
    try {

        const authors = await AuthorsService.getAll();
        res.json(authors);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/:id', authorizeAndExtractToken, authorizeRoles('admin', 'user'), async (req, res, next) => {
    const {
        id
    } = req.params;
    try {

        validateFields({
            id: {
                value: id,
                type: 'ascii'
            }
        });
        const author = await AuthorsService.getById(id);
        res.json(author);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.put('/:id', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        id
    } = req.params;
    const {
        firstName,
        lastName
    } = req.body;
    try {

        const fieldsToBeValidated = {
            id: {
                value: id,
                type: 'ascii'
            },
            firstName: {
                value: firstName,
                type: 'alpha'
            },
            lastName: {
                value: lastName,
                type: 'alpha'
            }
        };

        validateFields(fieldsToBeValidated);

        await AuthorsService.updateById(id, firstName, lastName);
        res.status(204).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.delete('/:id', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        id
    } = req.params;

    try {

        validateFields({
            id: {
                value: id,
                type: 'ascii'
            }
        });
        // se poate modifica 
        await AuthorsService.deleteById(id);
        res.status(204).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

module.exports = router;