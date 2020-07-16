const GenericStrategy = require('./GenericStrategy');
const yaml = require('js-yaml');
const axios = require('axios').default;
const crypto = require('crypto');

class ComposeProcessor extends GenericStrategy {
  constructor() {
    super();
  }

  async downloadRawFile(url) {
    let tempUrl = url;
    if (!tempUrl.includes('raw.githubusercontent')) {
        tempUrl = tempUrl.replace(/github.com/i, 'raw.githubusercontent.com');
        tempUrl = tempUrl.replace(/blob\//i, '');
        tempUrl = tempUrl.replace('#', '%23');
      }

      let compose = await axios.get(tempUrl);
      compose = compose.data;

      return { rawData: compose, rawUrl: tempUrl };
  }

  async processStep(data, rawUrl, sha) {
    let services = [];
    let depends_on = [];
    let deployment = {};
    let includes = [];

    let composeParsed = {};

    if (!data || !rawUrl || !sha)
      return;

    try {
      composeParsed = yaml.safeLoad(data);
    } catch (e) {
      console.error(e);
      return;
    }

    // typical compose file
    if ('services' in composeParsed) {
      Object.keys(composeParsed.services).forEach((key) => {
        if (composeParsed.services[key] == null) return;
        services.push({
          name: key,
          type: 'Docker',
          image: ((composeParsed.services[key] || {}).image || '').split(':')[0] || composeParsed.services[key].build || (composeParsed.services[key].build || {}).context || composeParsed.services[key].dockerfile,
          version: ((composeParsed.services[key] || {}).image || '').split(':')[1] || composeParsed.services[key].build ? 'N/A' : 'N/A',
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
    }

    // TODO: check if you can have multiple services defined without a proper structure
    // TODO: remove code duplication
    // example https://github.com/pozgo/docker-teamspeak/blob/master/docker-compose.yml
    // compose file that directly declares services
    if (!('services' in composeParsed)) {
      Object.keys(composeParsed).forEach((key) => {
        if (composeParsed[key] == null) return;
         services.push({
          name: key,
          type: 'Docker',
          image: ((composeParsed[key] || {}).image || '').split(':')[0] || composeParsed[key].build || (composeParsed[key].build || {}).context || composeParsed[key].dockerfile,
          version: ((composeParsed[key] || {}).image || '').split(':')[1] || composeParsed[key].build ? 'N/A' : 'N/A',
          metadata: JSON.stringify({
            environment: composeParsed[key].environment,
            ports: composeParsed[key].ports,
            command: composeParsed[key].command,
          }),
        });

        if (composeParsed[key].depends_on) {
          try {
            composeParsed[key].depends_on.forEach(e => {
              // A depends on B
              depends_on.push({
                  serviceA: key,
                  serviceB: e
              })
            });
          } catch(e) {
            // e.g. edge case of -X instead - X
            console.error(e);
          }
        }

      });
    }
    
    deployment.rawUrl = rawUrl;
    deployment.type = 'docker-compose';
    deployment.name = rawUrl.split('/').pop();
    deployment.id = sha;
    deployment.executable = -1; // -1 = not yet evaluated
    deployment.version = composeParsed.version || 'N/A';

    services.forEach(e => {
      includes.push({
        deploymentId: deployment.id,
        serviceName: e.name,
      })
    });
    
    return {services, deployment, includes, depends_on};
  }

  async process(data) {
    if (data.url) {
      // url was supplied
      let { rawData, rawUrl} = await this.downloadRawFile(data.url);

      return await this.processStep(rawData, rawUrl, data.sha);
    } else {
      // possibly provide the whole raw compose file already
      
      return await this.processStep(data, 'rawFile supplied', data.sha);
    }
  }

  async batchProcess(data) {
    return;
  }
}

module.exports = ComposeProcessor;
