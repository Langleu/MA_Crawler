

class MessagingHandler {
  constructor(io) {
    if (process.env.TYPE == 'master') {
      require('./server/index')(io);
    } else {
      require('./client/index');
    }
  }
}

module.exports = MessagingHandler;
