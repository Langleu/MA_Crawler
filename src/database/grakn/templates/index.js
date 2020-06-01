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
    case 'own':
      return own;
    case 'include':
      return include;
    case 'deployment':
      return deployment;
    case 'user':
      return user;
    case 'repo':
      return repo;
    case 'image':
      return image;
    default:
      console.log(`${template} is currently not implemented`);
  }
};
