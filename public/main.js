const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

document.getElementById('roomName').innerHTML = 'Room ' + room

const socket = io()

socket.emit('join room', { username, room })

socket.on('new message', (data) => {
    const div = document.createElement('div')
    const messages = document.getElementById('messages')
    div.innerHTML = `<b>${data.username}: </b><span>${data.text}</span><small style='float:right'>${data.time}</small>`
    messages.appendChild(div)
})

function sendMessage() {
    const message = document.getElementById('message').value
    socket.emit('send message', message)
}