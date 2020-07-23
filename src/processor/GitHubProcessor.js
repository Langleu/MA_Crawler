const GenericStrategy = require('./GenericStrategy');
const ComposeProcessor = new (require('./ComposeProcessor'))();
const logger = require('../../logger');

class GitHubProcessor extends GenericStrategy {
  constructor() {
    super();
  }

  async process(data) {
    data = data;
    let user = {};
    let repository = {};
    let owns = [];
    let contains = [];

    let owner = data.repository.owner; 

    user.id = owner.id;
    user.name = owner.login;
    user.platform = 'github';

    repository.id = data.repository.id;
    repository.name = data.repository.name;
    repository.description = data.repository.description;
    repository.fork = data.repository.fork;

    try {
      var {services, deployment, includes, depends_on} = await ComposeProcessor.process({ url: data.html_url, sha: data.sha });
    } catch (e) {
      logger.error(data.html_url);
      logger.error(e);
      return;
    }

    owns.push({ userId: user.id, repoId: repository.id });
    contains.push({ repoId: repository.id, deploymentId: deployment.id });

    return {user, owns, repository, contains, deployment, includes, services, depends_on};
  }

  async batchProcess(data) {
    let processed = [];

    // TODO: possible parallel implementation
    for (const item of data.items) {
      processed.push(await this.process(item));
    }

    return processed;
  }
}

module.exports = GitHubProcessor;
