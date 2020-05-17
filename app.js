const Koa = require('koa');
const koaBody = require('koa-body');
const MessagingHandler = require('./src/messaging/index');
const config = require('./config');

const app = new Koa();
const port = config.port;

let server = null;
let io = null;

if (config.type == 'master') {
  server = require('http').createServer(app.callback());
  io = require('socket.io')(server);
  
  server.listen(port);
} else {
  server = app.listen(port);
}

new MessagingHandler(io);

const router = require('./src/api/index')(io);
app.use(koaBody());
app.use(router());


console.log(`The server was started on port: ${port}`);

module.exports = {server};
