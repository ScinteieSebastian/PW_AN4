const {
    SupportMessages
} = require('../data');

const {
    ServerError
} = require('../errors')

const add = async (question, postedBy, email) => {
    // create new Book obj
    const answer = "";
    const supportMessage =  new SupportMessages({
        question: question,
        answer: answer,
        impFlag: false,
        postedBy: postedBy,
        email: email
    })

    // save it
    await supportMessage.save();
};

const getAll = async () => {
    // get all books
    // populate 'author' field
    // modify output so author is made of 'author.firstName author.lastName'

    supportMessages = await SupportMessages.find();
    return supportMessages;
};

const getById = async (id) => {
    // get book by id
    // populate 'author' field
    // modify output so author is made of 'author.firstName author.lastName'
    supportMessages = await SupportMessages.findById(id);
    return supportMessages;
};

const updateAnswerById = async (id, answer) => {
    // update by id
    SupportMessages.findByIdAndUpdate(id, { answer }).then((res) => {
        return res;
    })
};

const updateImpFlagById = async (id, impFlag) => {
    // update by id
    await SupportMessages.findByIdAndUpdate(id, { impFlag });
};

const deleteById = async (id) => {
    // delete by id
    await SupportMessages.findByIdAndDelete(id);
};

module.exports = {
    add,
    getAll,
    getById,
    updateAnswerById,
    updateImpFlagById,
    deleteById
}