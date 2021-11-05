const {
    GameRoom
} = require('../data');

const {
    ServerError
} = require('../errors')

const add = async (card) => {
    // create new Book obj
    let status = 'avail';
    let chatrooms = ["story", "hint"]
    const gameRoom =  new GameRoom({
        card: card,
        status: status,
        chatrooms: chatrooms
    })

    // save it
    return gameRoom.save();
    // return gameRoom;
};

const getAll = async () => {
    // get all books
    // populate 'author' field
    // modify output so author is made of 'author.firstName author.lastName'

    gameRooms = await GameRoom.find().populate()
    return gameRooms;
};

const getById = async (id) => {
    // get book by id
    // populate 'author' field
    // modify output so author is made of 'author.firstName author.lastName'
    gameRoom = await GameRoom.findById(id).populate({path: 'card'});
    return gameRoom;
};

const updateById = async (id, gameRoom) => {
    // update by id
    await GameRoom.findByIdAndUpdate(id, gameRoom);
};

const getAllChatRooms = async (id) => {
    // delete by id
    gameRooms = await GameRoom.find().populate()
    let chatrooms = []
    if (gameRooms.length > 0) {
        gameRooms.forEach(element => {
            element.chatrooms.forEach(item => {
                let chatroomName = element._id + item
                chatrooms.push(chatroomName)
            })
        });
    }
    return chatrooms;
};

module.exports = {
    add,
    getAll,
    updateById,
    getById,
    getAllChatRooms
}