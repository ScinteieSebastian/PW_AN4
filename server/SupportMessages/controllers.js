const express = require('express');

const SupportMessageService = require('./services.js');
const UserService = require('../Users/services.js')
const {
    validateFields,
    sendEmail
} = require('../utils');
const {
    authorizeAndExtractToken
} = require('../security/Jwt');
const {
    ServerError
} = require('../errors');
const {
    authorizeRoles
} = require('../security/Roles');

const router = express.Router();

router.post('/', authorizeAndExtractToken, authorizeRoles('user'), async (req, res, next) => {
    const {
        question,
        postedBy,
        username
    } = req.body;
    try {
        const user = await UserService.findByUsername(username);
        await SupportMessageService.add(question, postedBy, user.email);

        res.status(201).end();
    } catch (err) {
        if (err.message) {
            let mongoErr = new ServerError(err.message, 500);
            next(mongoErr);
        } else {
            next(err);
        }
    }
}); 

router.get('/', authorizeAndExtractToken, authorizeRoles('admin', 'user', 'support'), async (req, res, next) => {
    try {
        // do logic
        const supportMessages = await SupportMessageService.getAll();
        res.json(supportMessages);
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
        // do logic
        const books = await BooksService.getById(id);
        res.json(books);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.put('/answer', authorizeAndExtractToken, authorizeRoles('support'), async (req, res, next) => {
    const {
        id,
        answer
    } = req.body;
    try {
       // do logic
        await SupportMessageService.updateAnswerById(id, answer)
        const supportMessage = await SupportMessageService.getById(id);
        var registerEmail = new sendEmail(supportMessage.email, 'supportAnswer', "", supportMessage);
        registerEmail.supportEmail()
            .then(
                response => {
                    res.status(204).end();
                },
                error => {
                    next(error);
                }
            )
    } catch (err) {
        if (err.message) {
            let mongoErr = new ServerError(err.message, 500);
            next(mongoErr);
        } else {
            next(err);
        }
        next(err);
    }
});

router.put('/imp-flag', authorizeAndExtractToken, authorizeRoles('support'), async (req, res, next) => {
    const {
        id,
        impFlag
    } = req.body;
    try {
       // do logic
        await SupportMessageService.updateImpFlagById(id, impFlag);
        res.status(204).end();
    } catch (err) {
        if (err.message) {
            let mongoErr = new ServerError(err.message, 500);
            next(mongoErr);
        } else {
            next(err);
        }
        next(err);
    }
});


router.delete('/:id', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        id
    } = req.params;
    try {
        // do logic
        await SupportMessageService.deleteById(id);
        res.status(204).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

module.exports = router;