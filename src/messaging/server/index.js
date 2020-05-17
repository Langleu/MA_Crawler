
module.exports = (io) => {
  io.on('connection', (socket) => { 
    socket.emit('event', 'test');

    // Playground to target single sockets
    io.sockets.sockets[Object.keys(io.sockets.sockets)[0]].emit('event', 'test2');
    console.log(Object.keys(io.sockets.sockets));

    socket.on('disconnect', (reason) => {
          console.log(Object.keys(io.sockets.sockets));
    });
  });
}
