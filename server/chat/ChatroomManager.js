const Chatroom = require('./Chatroom')
const GameRoomService = require('../GamesRoom/services.js');

class ChatroomManager {
  // mapping of all available chatrooms
  constructor() {
    this.chatrooms = new Map(
      ["story", "hint"].map(c => [
        c,
        Chatroom(c, "")
      ])
    )
  }

  removeClient(client) {
    this.chatrooms.forEach(c => c.removeUser(client))
  }

  async getChatroomByName(chatroomName) {
    let chatroomsNames = await GameRoomService.getAllChatRooms()
    
    chatroomsNames.forEach((elem) => {
      if (!this.chatrooms.has(elem)) {
        this.chatrooms.set(elem, Chatroom(elem, ""))
      }
    })
    return this.chatrooms.get(chatroomName)


  }

  serializeChatrooms() {
    return Array.from(this.chatrooms.values()).map(c => c.serialize())
  }
}

module.exports = new ChatroomManager();