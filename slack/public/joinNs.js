function joinNs(endpoint) {
  if (nsSocket) {
    //whether nsSocket actually exists
    nsSocket.close();
    // remove the EventListener beore its added again
    document.querySelector('.message-form').removeEventListener('submit', formSubmission);
  }
  nsSocket = io(`http://localhost:8000${endpoint}`)
  nsSocket.on('nsRoomLoad', (nsRooms) => {
    let roomList = document.querySelector('.room-list');
    roomList.innerHTML = "";
    nsRooms.forEach((room, i) => {
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${room.privateRoom ? 'lock' : 'globe'}"></span>${room.roomTitle}</li>`
    });

    // add click listener to each room
    let roomNodes = document.getElementsByClassName('room')
    Array.from(roomNodes).forEach((elem, i) => {
      elem.addEventListener('click', (e) => {
        joinRoom(e.target.innerText);
      })
    });

    // add Room automatically.. first time here
    const topRoom = document.querySelector('.room');
    const topRoomName = topRoom.innerText;
    joinRoom(topRoomName);
  });

  nsSocket.on('messageToClients', (msg) => {
    const newMsg = buildHTML(msg)
    document.querySelector('#messages').innerHTML += newMsg;
  })

  document.querySelector('.message-form').addEventListener('submit', formSubmission)
}

function formSubmission(e) {
    e.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    nsSocket.emit('newMessageToServer', {text: newMessage})
}

function buildHTML(msg) {
  const convertedDate = new Date(msg.time).toLocaleString();
  const newHTML = `
  <li><div class="user-image"><img src="${msg.avatar}" alt="avatar" /></div><div class="user-message"><div class="user-name-time">${msg.username} <span>${convertedDate}</span></div><div class="message-text">${msg.text}</div></div></li>
  `
  return newHTML;
}
