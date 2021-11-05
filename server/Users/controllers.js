const express = require('express');
const randtoken = require('rand-token');
const validator = require('validator');


const UsersService = require('./services.js');
const verifcationController = require('./verification');
// const sendEmail = require('../utils')
const {
    validateFields,
    sendEmail,
} = require('../utils');

const {
    authorizeAndExtractToken
} = require('../security/Jwt');
const {
    authorizeRoles
} = require('../security/Roles');

const router = express.Router();

router.post('/register', async (req, res, next) => {
    const {
        firstName,
        lastName,
        username,
        email,
        password,
        group
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
            },
            username: {
                value: username,
                type: 'alphanumeric'
            },
            email: {
                value: email,
                type: 'email'
            },
            password: {
                value: password,
                type: 'ascii'
            },
            group: {
                value: group,
                type: 'alpha'
            }

        };
        validateFields(fieldsToBeValidated);

        var scode = randtoken.generate(30);

        UsersService.add(firstName, lastName, username, email, password, scode, group)
            .then(
                async (response) => {
                    var registerEmail = new sendEmail(email, 'accountActivation', scode, "");
                    registerEmail.email()
                        .then(
                            response => {
                                res.status(201).end();
                            },
                            error => {
                                next(error);
                            }
                        )
                },
                error => {
                    next(error);
                }
            )

    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    try {
        // do logic
        const users = await UsersService.getAll();
        res.json(users);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.put('/favorites', authorizeAndExtractToken, authorizeRoles('user'), async (req, res, next) => {
    const {
        username,
        gameId
    } = req.body
    try {
        // do logic
        await UsersService.updateFavorite(username, gameId);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
})

router.get('/favorites/:username', authorizeAndExtractToken, authorizeRoles('user'), async (req, res, next) => {
    const {
        username
    } = req.params
    try {
        // do logic
        const favorites = await UsersService.getFavorites(username);
        res.json(favorites);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/verify/:email/:code', (req, res) => {
    verifcationController.verifyEmail(req.params.email, req.params.code)
        .then(verification => {
            res.status(verification.code).json({
                result: verification.result,
                code: verification.code,
                message: verification.message
            })
        })
        .catch(verificationError => {
            res.status(verificationError.code).json({
                result: verificationError.result,
                code: verificationError.code,
                message: verificationError.message
            })
        })
})

router.post('/accept-termns', authorizeAndExtractToken, async (req, res, next) => {
    const {
        username
    } = req.body
    await UsersService.verifyTermns(username);
    res.status(201).end();
})

router.post('/login', async (req, res, next) => {
    const {
        username,
        password
    } = req.body;

    try {
        const fieldsToBeValidated = {
            username: {
                value: username,
                type: 'username'
            },
            password: {
                value: password,
                type: 'ascii'
            }
        };

        validateFields(fieldsToBeValidated);

        const token = await UsersService.authenticate(username, password);

        res.status(200).json(token);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
})

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
        await UsersService.deleteById(id);
        res.status(204).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.post('/report', authorizeAndExtractToken, authorizeRoles('admin', 'support'), async (req, res, next) => {
    const {
        id,
        email
    } = req.body;
    try {
        const supportMessage = "Reported";
        var registerEmail = new sendEmail(email, 'reportMessage', supportMessage, "");
        registerEmail.email()
            .then(
                response => {
                    res.status(201).end();
                },
                error => {
                    next(error);
                }
            )
    } catch (err) {
        next(err);
    }
});

module.exports = router;