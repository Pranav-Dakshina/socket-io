const express = require('express');
const app = express();
const socket = require('socket.io');

const namespaces = require('./data/namespaces');
// console.log(namespace);



app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(8000);
const io = socket(expressServer);


io.on('connection', (socket) => {

  // build an array to send back with the img and endpoint for each NS
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint
    }
  })
  // console.log(nsData);
  // send the nsData back to the client, We need to use socket, NOT io, because we want it to go to just this client
  socket.emit('nsList', nsData);
});

// loop through each namespace and listen for a connection
namespaces.forEach((namespace, i) => {
  // console.log(namespace);
  io.of(namespace.endpoint).on('connection', (nsSocket) => {
    console.log(`${nsSocket.id} ${namespace.endpoint}`);
    //sent username from socket handshake
    const username = nsSocket.handshake.query.username;
    // a socket has connected to one of our chatgroup namespaces.
    // send that ns group info back
    nsSocket.emit('nsRoomLoad', namespace.rooms);
    nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave)
      updateUsersInRoom(namespace, roomToLeave)
      nsSocket.join(roomToJoin)
      // io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
      //   console.log(clients.length);
      //   numberOfUsersCallback(clients.length);
      // })
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomToJoin;
      })
      nsSocket.emit('historyCatchUp', nsRoom.history);
      updateUsersInRoom(namespace, roomToJoin)
    })
    nsSocket.on('newMessageToServer', (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username,
        avatar: 'https://via.placeholder.com/30'
      }
      // Send this message to ALL the sockets that are in the room that THIS socket is in.
      // how can we find out what rooms THIS socket is in ?
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      // we need to find the Room object for this room
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomTitle;
      })

      nsRoom.addMessage(fullMsg);
      io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg);
    })
  })
});

function updateUsersInRoom(namespace, roomTitle) {
  // Send back the number of users in the the room to ALL sockets connected to this room
  io.of(namespace.endpoint).in(roomTitle).clients((error, clients) => {
    console.log(`There are ${clients.length} in this room`)
    io.of(namespace.endpoint).in(roomTitle).emit('updateMembers', clients.length)
  })
}
