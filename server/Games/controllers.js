const express = require('express');
const multer = require('multer');

const GamesService = require('./services.js');
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

const DIR = './uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

router.post('/', authorizeAndExtractToken, authorizeRoles('user', 'admin'), upload.single('image'), async (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    const {
        title,
        desc,
        story,
        author
    } = req.body;
    const image = url + '/uploads/' + req.file.filename;
    try {
        await GamesService.add(title, desc, story, author, image);
        res.status(201).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        // pot sa primesc eroare si ca genul nu e bun, trebuie verificat mesajul erorii
        // HINT err.message
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
        const games = await GamesService.getAll();
        res.json(games);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.put('/approve', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        id,
        approved
    } = req.body;
    try {
        await GamesService.approve(id, approved);
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

router.delete('/:id', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        id
    } = req.params;
    try {
        // do logic
        await GamesService.deleteById(id);
        res.status(204).end();
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
        const game = await GamesService.getById(id);
        res.json(game);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

// router.get('/authors/:id', authorizeAndExtractToken, authorizeRoles('admin', 'user'), async (req, res, next) => {
//     const {
//         id
//     } = req.params;
//     try {
//         // do logic
//         const books = await BooksService.getByAuthorId(id);
//         res.json(books);
//     } catch (err) {
//         // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
//         next(err);
//     }
// });

router.put('/:id', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        id
    } = req.params;
    const {
        title,
        desc,
        story
    } = req.body;
    try {
       // do logic
        await GamesService.updateById(id, title, desc, story);
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

// router.delete('/:id', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
//     const {
//         id
//     } = req.params;
//     try {
//         // do logic
//         await BooksService.deleteById(id);
//         res.status(204).end();
//     } catch (err) {
//         // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
//         next(err);
//     }
// });

module.exports = router;