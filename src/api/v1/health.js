const Router = require('@koa/router');
const router = new Router({prefix: '/v1/health'});

// possible implementation to check whether master
router.get('/', async (ctx, next) => {
  ctx.body = {
    status: '200',
    msg: 'ok',
  };
});

module.exports = router;
