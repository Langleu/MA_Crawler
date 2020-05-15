const combineRouters = require('koa-combine-routers');

// actual routes
const healthV1 = require('./v1/health');
const defaultV1 = require('./v1/index');
const crawlV1 = require('./v1/crawl');

const routes = [
  healthV1,
  defaultV1,
  crawlV1,
];

const router = combineRouters(routes);

module.exports = router;
