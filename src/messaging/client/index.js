const socket = require('socket.io-client')('http://localhost:8000');
socket.on('connect', () => {
  console.log('connected');
});
socket.on('event', (data) => {
  console.log(data);
});
socket.on('disconnect', () => {
  
});