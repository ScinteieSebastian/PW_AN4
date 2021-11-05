const express = require('express');
const GamesService = require('../Games/services.js');
const GameRoomService = require('./services.js');
const {
    validateFields
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
        idCard
    } = req.body;
    try {
        let card = await GamesService.getById(idCard);
        GameRoomService.add(card)
            .then((response) => {
                res.json(response);
            })
            .catch((err) => next(err));
    } catch (err) {
        if (err.message) {
            let mongoErr = new ServerError(err.message, 500);
            next(mongoErr);
        } else {
            next(err);
        }
    }
}); 

router.get('/', authorizeAndExtractToken, authorizeRoles('user'), async (req, res, next) => {
    try {
        // do logic
        const gameRooms = await GameRoomService.getAll();
        res.json(gameRooms);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/:id', authorizeAndExtractToken, authorizeRoles('user'), async (req, res, next) => {
    const {
        id
    } = req.params;
    try {
        // do logic
        const gameRoom = await GameRoomService.getById(id);
        res.json(gameRoom);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.put('/:id', authorizeAndExtractToken, authorizeRoles('user'), async (req, res, next) => {
    const {
        id
    } = req.params;
    try {
        let gameRoom = await GameRoomService.getById(id);
        gameRoom.status = 'unavail';
        await GameRoomService.updateById(id, gameRoom);
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

router.get('/chatrooms', authorizeAndExtractToken, authorizeRoles('user'), async (req, res, next) => {
    try {
        // do logic
        const chatrooms = await GameRoomService.getAllChatRooms();
        res.json(chatrooms);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});



module.exports = router;