const {
    Games
} = require('../data');

const {
    ServerError
} = require('../errors')

const add = async (title, desc, story, author, image) => {
    // create new Book obj
    let approved = false;
    const game =  new Games({
        title: title,
        desc: desc,
        story: story,
        author: author,
        image: image,
        approved: approved
    })

    // save it
    await game.save();
};

const getAll = async () => {
    // get all books
    // populate 'author' field
    // modify output so author is made of 'author.firstName author.lastName'

    games = await Games.find().populate()
    return games;
};

const approve = async (id, approved) => {
    game = await Games.findById(id);
    game.approved = approved;
    await game.save();
}

const getById = async (id) => {
    // get book by id
    // populate 'author' field
    // modify output so author is made of 'author.firstName author.lastName'
    game = await Games.findById(id);
    return game;
};

// const getByAuthorId = async (id) => {
//     // get book by author id
//     // modify output so author is made of 'author.firstName author.lastName'
//     const books = await Books.find({'author': id}).populate({path: 'author', select: '-_id firstName lastName'});
//     return books;
// };

const updateById = async (id, title, desc, story) => {
    // update by id
    await Games.findByIdAndUpdate(id, { title, desc, story });
};

const deleteById = async (id) => {
    // delete by id
    await Games.findByIdAndDelete(id);
};

module.exports = {
    add,
    getAll,
    approve,
    deleteById,
    updateById,
    getById
    // getByAuthorId,
    // updateById,
    // deleteById
}