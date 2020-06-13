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
      let depends_on = [];
      let deployment = {};
      let includes = [];

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

        if (composeParsed.services[key].depends_on) {
          composeParsed.services[key].depends_on.forEach(e => {
            // A depends on B
            depends_on.push({
                serviceA: key,
                serviceB: e
            })
          });
        }

      });
      
      deployment.rawUrl = url;
      deployment.type = 'docker-compose';
      deployment.name = url.split('/').pop();
      deployment.id = data.sha;
      deployment.executable = -1; // -1 = not yet evaluated
      deployment.version = composeParsed.version;

      services.forEach(e => {
        includes.push({
          deploymentId: deployment.id,
          serviceName: e.name,
        })
      });
      
      return {services, deployment, includes, depends_on};
    } else {
      // possibly provide the whole raw compose file already

      return;
    }
  }

  async batchProcess(data) {
    return;
  }
}

module.exports = ComposeProcessor;
