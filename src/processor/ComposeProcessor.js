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

      let services = [];

      Object.keys(composeParsed.services).forEach((key) => {
        services.push({
          name: key,
          type: 'Docker',
          image: composeParsed.services[key].image.split(':')[0],
          version: composeParsed.services[key].image.split(':')[1],
          metadata: JSON.stringify({
            environment: composeParsed.services[key].environment,
            ports: composeParsed.services[key].ports,
            command: composeParsed.services[key].command,
          }),
        });

        console.log(key, composeParsed.services[key]);

      });
      
      let deployment = {};
      deployment.rawUrl = url;
      deployment.type = 'docker-compose';
      deployment.name = url.split('/').pop();
      deployment.id = data.sha;
      deployment.executable = -1; // -1 = not yet evaluated
      deployment.version = composeParsed.version;

      // TODO: add relation of includes and depends_on
      
      return {services, deployment};
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
