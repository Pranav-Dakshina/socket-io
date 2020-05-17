const socket = io('http://localhost:8000');
const socket2 = io('http://localhost:8000/admin');

socket.on('messageFromServer', (dataFromServer) => {
  console.log(dataFromServer);
  socket.emit('messageToServer', {data: 'Data from the Client!'});
});

socket2.on("welcome", (dataFromServer) => {
  console.log(dataFromServer);
})

document.querySelector('#message-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const newMessage = document.querySelector('#user-message').value;
  socket.emit('newMessageToServer', {text: newMessage})
})

socket.on('messageToClients', (msg) => {
  document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`;
})
