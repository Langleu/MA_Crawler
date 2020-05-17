const socket = require('socket.io-client')('http://localhost:8000');
const axios = require('axios').default;

socket.on('connect', () => {
  console.log('connected');
});
socket.on('event', (data) => {
  console.log(data);
});

socket.on('crawl', (data) => {
  // TODO: call up /crawl with axios and page 1,2,3... sent result to processing or return to master.
});

socket.on('disconnect', () => {
  
});