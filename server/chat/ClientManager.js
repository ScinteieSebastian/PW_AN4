const UsersService = require('../Users/services.js');

class ClientManager {
    // mapping of all connected clients
    constructor() {
        this.clients = new Map()
    }

    addClient(client) {
        this.clients.set(client.id, { client })
    }

    registerClient(client, user) {
        this.clients.set(client.id, { client, user })
    }

    removeClient(client) {
        this.clients.delete(client.id)
    }

    async getAvailableUsers() {
        const usersTaken = new Set(
            Array.from(this.clients.values())
                .filter(c => c.user)
                .map(c => c.user.name)
        )
        users = await UsersService.getAll()
        return users.filter(u => !usersTaken.has(u.username))
    }

    async isUserAvailable(userName) {
        const availUsers = await this.getAvailableUsers()
        return availUsers.filter(u => u.username === userName);
    }

    async getUserByName(userName) {
        users = await UsersService.getAll();
        return users.find(u => u.username === userName)
    }

    getUserByClientId(clientId) {
        return (this.clients.get(clientId) || {}).user
    }
}

module.exports = new ClientManager();