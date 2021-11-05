
const http = require("http");
const app = require("./app.js")
const server = http.createServer(app);
const io = require('socket.io')(server, { origins: '*:*'})

const ClientManager = require('./chat/ClientManager.js')
const ChatroomManager = require('./chat/ChatroomManager.js')
const makeHandlers = require('./chat/handlers.js')

io.on('connection', function (client) {
    const {
        handleRegister,
        handleJoin,
        handleLeave,
        handleMessage,
        handleGetChatrooms,
        handleGetAvailableUsers,
        handleDisconnect
    } = makeHandlers(client, ClientManager, ChatroomManager)

    console.log('client connected...', client.id)
    ClientManager.addClient(client)
    
    client.on('register', handleRegister)

    client.on('join', handleJoin)

    client.on('leave', handleLeave)

    client.on('message', handleMessage)

    client.on('chatrooms', handleGetChatrooms)

    client.on('availableUsers', handleGetAvailableUsers)

    client.on('disconnect', function () {
        console.log('client disconnect...', client.id)
        handleDisconnect()
    })

    client.on('error', function (err) {
        console.log('received error from client:', client.id)
        console.log(err)
    })
})

server.listen(process.env.PORT, function (err) {
    if (err) throw err
    console.log(`App is listening on ${process.env.PORT}`);
})
