const {
    Books,
    Authors
} = require('../data');

const {
    ServerError
} = require('../errors')

const add = async (name, authorId, genres) => {
    // create new Book obj
    
    const book =  new Books({
        author: authorId,
        name: name,
        genres: genres
    })

    // save it
    await book.save();
};

const getAll = async () => {
    // get all books
    // populate 'author' field
    // modify output so author is made of 'author.firstName author.lastName'

    books = await Books.find().populate({path: 'author', select: '-_id firstName lastName'})
    return books;
};

const getById = async (id) => {
    // get book by id
    // populate 'author' field
    // modify output so author is made of 'author.firstName author.lastName'
    book = await Books.findById(id).populate({path: 'author', select: '-_id firstName lastName'});
    return book;
};

const getByAuthorId = async (id) => {
    // get book by author id
    // modify output so author is made of 'author.firstName author.lastName'
    const books = await Books.find({'author': id}).populate({path: 'author', select: '-_id firstName lastName'});
    return books;
};

const updateById = async (id, name, authorId, genres) => {
    // update by id
    await Books.findByIdAndUpdate(id, { name, authorId, genres });
};

const deleteById = async (id) => {
    // delete by id
    await Books.findByIdAndDelete(id);
};

module.exports = {
    add,
    getAll,
    getById,
    getByAuthorId,
    updateById,
    deleteById
}