const GenericStrategy = require('./GenericStrategy');
const yaml = require('yaml');
const axios = require('axios').default;
const crypto = require('crypto');

class ComposeProcessor extends GenericStrategy {
  constructor() {
    super();
  }

  async process(data) {
    if (data.url) {
      // url was supplied
      let url = data.url;
      if (!url.includes('raw.githubusercontent')) {
        url = url.replace(/github.com/i, 'raw.githubusercontent.com');
        url = url.replace(/blob\//i, '');
      }

      let compose = await axios.get(url);
      compose = compose.data;
      let composeParsed = yaml.parse(compose);

      console.log(composeParsed);

      let deployment = {};
      deployment.rawUrl = url;
      deployment.type = 'docker-compose';
      deployment.name = url.split('/').pop();
      deployment.id = data.sha;
      deployment.executable = -1; // -1 = not yet evaluated
      deployment.version = composeParsed.version;
      console.log(deployment);
      
      return;
    } else {
      // object was supplied

    }

    return;
  }

  async batchProcess(data) {
    return;
  }
}

module.exports = ComposeProcessor;
