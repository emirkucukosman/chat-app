const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = proccess.env.PORT || 5000
const formatMessage = require('./utils/message')
const {
    userJoin,
    getCurrentUser,
    userLeave
  } = require('./utils/users');

app.use(express.static('public'))

io.on('connection', (socket) => {

    socket.on('join room', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)
        socket.join(room)
        socket.broadcast.to(user.room).emit('new message', formatMessage('Bot', user.username + ' has joined the chat'))
    })

    socket.on('send message', (message) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('new message', formatMessage(user.username, message))
    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if (user) {
            io.to(user.room).emit('new message', formatMessage('Bot', `${user.username} has left the chat`));
        }
    })

})

server.listen(port, () => {
    console.log('server listening on port ' + port);
})
