const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const messages = []
const users = []

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

io.on('connection', (socket) => {
  console.log('Пользователь подключился')

  socket.on('user join', (username) => {
    users.push(username)
    socket.broadcast.emit('user joined', username)
    socket.emit('welcome', username, users)
  })


  socket.on('chat message', (message, color) => {
    messages.push({message, color})
    io.emit('chat message', {message, color})
  })

  socket.emit('init messages', messages)

  socket.on('disconnect', () => {
    console.log('Пользователь отключился')
  })
})

server.listen(3000, () => {
  console.log('Сервер запущен на порту 3000')
})
