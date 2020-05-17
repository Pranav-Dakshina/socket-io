const http = require('http')
const socket = require('socket.io')

const server = http.createServer((req, res) => {
  console.log('I am connected');
  res.end('I am connected!')
})

const io = socket(server)

io.on('connection', (socket, req) => {
  socket.emit('welcome', 'Welcome to the websocket server!!')

  socket.on('message', (msg) => {
    console.log(msg);
  })
})

server.listen(7000)
