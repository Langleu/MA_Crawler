const contain = require('./contain');
const depend = require('./depend');
const own = require('./own');
const include = require('./include');
const logger = require('../../../../logger');

const deployment = require('./deployment');
const user = require('./user');
const repo = require('./repo');
const service = require('./service');

module.exports = (template) => {
  switch(template) {
    case 'contain':
      return contain;
    case 'depend':
      return depend;
    case 'deployment':
      return deployment;
    case 'include':
      return include;
    case 'own':
      return own;
    case 'repo':
      return repo;
    case 'service':
      return service;
    case 'user':
      return user;
    default:
      logger.error(`${template} is currently not implemented`);
  }
};
