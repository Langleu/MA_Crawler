const GitHubProcessor = require('./GitHubProcessor');
const ComposeProcessor = require('./ComposeProcessor');

class GenericProcessor {
  constructor(type) {
    switch (type) {
      case 'GitHubAPI':
        this.strategy = new GitHubProcessor();
        break;
      case 'Compose':
        this.strategy = new ComposeProcessor();
        break;
      default:
        this.strategy = new GitHubProcessor();
    }
  }

  async process(data) {
    return await this.strategy.process(data);
  }

  async batchProcess(data) {
    return await this.strategy.batchProcess(data);
  }
}

module.exports = GenericProcessor;
