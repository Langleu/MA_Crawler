const Router = require('@koa/router');
const router = new Router({prefix: '/v1/process'});
const GenericProcessor = require('./../../processor/GenericProcessor');

const availableProcessors = ['GitHubAPI', 'Compose'];

router.get('/', async (ctx, next) => {
  ctx.body = {
    availableProcessors,
  };
});

router.post('/', async (ctx, next) => {
  const data = ctx.request.body;
  const type = data.processor;

  if (availableProcessors.includes(type)) {
    ctx.body = true;
    const processor = new GenericProcessor(type);

    ctx.body = await processor.batchProcess(data);
  } else {
    ctx.throw(400, 'processor not implemented!');
  }
});

module.exports = router;
