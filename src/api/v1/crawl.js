const Router = require('@koa/router');
const router = new Router({prefix: '/v1/crawl'});
const GenericCrawler = require('./../../crawler/GenericCrawler');

const availableCrawlers = ['GitHubAPI'];

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
    const crawler = new GenericCrawler(type);

    ctx.body = await crawler.crawl({term: data.term, page: data.page});
  } else {
    ctx.throw(400, 'crawler not implemented!');
  }
});

module.exports = router;
