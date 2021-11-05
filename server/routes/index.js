const Router = require('express')();

const AuthorsController = require('../Authors/controllers.js');
const BooksController = require('../Books/controllers.js');
const UsersController = require('../Users/controllers.js');
const SupportMessagesController = require('../SupportMessages/controllers.js');
const GamesController = require('../Games/controllers.js');
const GameRoomsController = require('../GamesRoom/controllers.js');

Router.use('/authors', AuthorsController);
Router.use('/books', BooksController);
Router.use('/users', UsersController);
Router.use('/support-messages', SupportMessagesController);
Router.use('/games', GamesController);
Router.use('/gameroom', GameRoomsController);

module.exports = Router;