const GenericStrategy = require('./GenericStrategy');

class GitHubProcessor extends GenericStrategy {
  constructor() {
    super();
  }

  async process(data) {
    let user = {};
    let repository = {};

    let owner = data.repository.owner; 

    user.id = owner.id;
    user.name = owner.login;
    user.platform = 'github';

    repository.id = data.repository.id;
    repository.name = data.repository.name;
    repository.description = data.repository.description;
    repository.fork = data.repository.fork;

    return {user, repository};
  }

  async batchProcess(data) {
    data.items.forEach(e => {
      
    });
    return;
  }
}

module.exports = GitHubProcessor;
