const express = require('express');
const app = express();
const socket = require('socket.io');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(8000);
const io = socket(expressServer);

io.on('connection', (socket) => {
  socket.emit('messageFromServer', {data: "Welcome to the socketio server"});
  socket.on('messageToServer', (dataFromClient) => {
    console.log(dataFromClient);
  });
  socket.on('newMessageToServer', (msg) => {
    // console.log(msg);
    io.emit('messageToClients', {...msg})
  })
})

io.of('/admin').on('connection', (socket) => {
  console.log("Someone connected to the admin namespace!");
  io.of('/admin').emit('welcome', "welcome to admin!!!")
})
