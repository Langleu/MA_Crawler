const Router = require('@koa/router');
const router = new Router({ prefix: '/'});

// possible implementation to check whether master
router.get('/', async (ctx, next) => {
    ctx.body = 'default';
});

module.exports = router;