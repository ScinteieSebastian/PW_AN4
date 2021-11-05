const {
    Authors,
} = require('../data');

const add = async (firstName, lastName) => {
    const author = new Authors({
        firstName,
        lastName
    });
    await author.save();
};

const getAll = async () => {
    return await Authors.find();
};

const getById = async (id) => {
    return await Authors.findById(id);
};

const updateById = async (id, firstName, lastName) => {
    await Authors.findByIdAndUpdate(id, { firstName, lastName });
};

const deleteById = async (id) => {
    await Authors.findByIdAndDelete(id);
};

module.exports = {
    add,
    getAll,
    getById,
    updateById,
    deleteById
}