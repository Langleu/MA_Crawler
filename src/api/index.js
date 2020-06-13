const combineRouters = require('koa-combine-routers');

module.exports = (io) => {

// actual routes
const healthV1 = require('./v1/health');
const defaultV1 = require('./v1/index');
const crawlV1 = require('./v1/crawl');
const processV1 = require('./v1/process');

// master routes
const orchestrateV1 = require('./v1/orchestrate')(io);

const routes = [
  healthV1,
  defaultV1,
  crawlV1,
  processV1,
];

// use config later
// master only routes
if (process.env.TYPE == 'master') {
  routes.push(orchestrateV1);
}

return router = combineRouters(routes);

}

//module.exports = router;
