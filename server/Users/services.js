const {
    Users
} = require('../data');

const {
    generateToken,
} = require('../security/Jwt');

const {
    ServerError
} = require('../errors');

const GamesService = require('../Games/services.js');

const {
    hash,
    compare
} = require('../security/Password');

const add = async (firstName, lastName, username, email, password, scode, group) => {
    const hashedPassword = await hash(password);
    const role = group;
    const termns = false;
    const status = 'inactive';
    const user = new Users({
        firstName,
        lastName,
        username,
        password: hashedPassword,
        email,
        role,
        scode,
        status,
        termns
    });

    const query = { 'username': username, 'email': email };
    const testUser = await Users.findOne(query);
    if (testUser != null) {
        throw new ServerError(`Utilizatorul inregistrat cu username: ${username} si email: ${email} exista!`, 404);
    }

    return user.save();
};

const authenticate = async (username, password) => {
    var user = await findByUsername(username);
    if (await compare(password, user.password)) {
        if (user.status == 'active') {
            return await generateToken({
                userId: user._id,
                userName: user.username,
                userFirstName: user.firstName,
                userLastName: user.lastName,
                userRole: user.role,
                userTermns: user.termns
            });
        } else {
            throw new ServerError("Validarea prin email nu a fost realizata", 404);
        }
    } 
    throw new ServerError("Combinatia de username si parola nu este buna!", 404);
};

const verifyTermns = async (username) => {
    var user = await findByUsername(username);
    user.termns = true;
    await Users.findByIdAndUpdate(user.id, user);
}

const updateFavorite = async (username, gameId) => {
    var user = await Users.findOne({ 'username': username }).populate({path: 'favorites'});
    var game = await GamesService.getById(gameId);
    user.favorites.push(game)
    await Users.findByIdAndUpdate(user._id, user);
}

const getFavorites = async (username) => {
    var user = await Users.findOne({ 'username': username }).populate({path: 'favorites'});
    return user.favorites;
}
const getAll = async () => {
    // get all books
    // populate 'author' field
    // modify output so author is made of 'author.firstName author.lastName'

    users = await Users.find();
    return users;
};

const findByUsername = async (username) => {
    var user = await Users.findOne({ 'username': username });
    if (user === null) {
        user = await Users.findOne({ 'email': username });
        if (user === null) {
            throw new ServerError(`Utilizatorul inregistrat cu ${username} nu exista!`, 404);
        }
    }
    return user;
}
module.exports = {
    add,
    findByUsername,
    verifyTermns,
    getAll,
    authenticate,
    getAll,
    getFavorites,
    updateFavorite
}