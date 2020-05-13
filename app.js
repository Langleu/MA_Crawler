const Koa = require('koa');
const koaBody = require('koa-body');
const router = require('./src/api/index');

const app = new Koa();
const port = process.env.PORT || 8000;

app.use(koaBody());
app.use(router());

const server = app.listen(port);
console.log(`The server was started on port: ${port}`);

module.exports = {server};
