const contain = require('./contain');
const own = require('./own');
const include = require('./include');

const deployment = require('./deployment');
const user = require('./user');
const repo = require('./repo');
const image = require('./image');

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
      console.log(`${template} is currently not implemented`);
  }
};
