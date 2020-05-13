const combineRouters = require('koa-combine-routers');

// actual routes
const healthV1 = require('./v1/health');
const defaultV1 = require('./v1/index');

const router = combineRouters(
    healthV1,
    defaultV1,
);

module.exports = router;
