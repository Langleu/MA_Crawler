const Router = require('@koa/router');
const availableCrawlers = ['GitHubAPI']; // TODO: add to config

module.exports = (io) => {
  const router = new Router({prefix: '/v1/orchestrate'});

router.get('/', async (ctx, next) => {
  ctx.body = {
    availableCrawlers,
  };
});

router.post('/', async (ctx, next) => {
  const data = ctx.request.body;
  const type = data.crawler;

  if (availableCrawlers.includes(type)) {
    ctx.body = true;

    // TODO: from here on divide depending on amount of clients and send pages x to y.

    console.log(Object.keys(io.sockets.sockets));

  } else {
    ctx.throw(400, 'crawler not implemented!');
  }
});

return router;
}

