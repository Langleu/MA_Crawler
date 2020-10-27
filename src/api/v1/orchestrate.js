const Router = require('@koa/router');
const availableCrawlers = ['GitHubAPI']; // TODO: add to config
const setMaxFileSize = 384000; // 384 kb in bytes, max allowed from GitHub API

module.exports = (io) => {
  const router = new Router({
    prefix: '/v1/orchestrate'
  });

  router.get('/', async (ctx, next) => {
    ctx.body = {
      availableCrawlers,
    };
  });

  router.post('/', async (ctx, next) => {
    const data = ctx.request.body;
    const type = data.crawler || data.type;
    const term = data.term;
    const initSize = parseInt(data.initSize) || 50; // set minimum to 50 bytes, even that is barely a docker-compose
    const maxFileSize = parseInt(data.maxSize) || setMaxFileSize;

    if (availableCrawlers.includes(type)) {
      ctx.body = true;
      let nodes = Object.keys(io.sockets.sockets).length;

      if (nodes == 0) {
        // TODO: possibly run the execution on the master?
        ctx.throw(500, 'master currently can`t handle any requests!');
      } else if (nodes > 0) {
        // orchestrate to nodes

        let fragment = Math.round(maxFileSize / nodes);

        Object.keys(io.sockets.sockets).forEach( (node, index) => {
          let request = {
            ending: initSize + fragment * (index + 1),
            beginning: initSize + fragment * index,
            term,
            crawler: type,
          }
          io.sockets.sockets[node].emit('crawl', `${JSON.stringify(request)}`);
        });
      }
    } else {
      ctx.throw(400, 'crawler not implemented!');
    }
  });

  return router;
}
