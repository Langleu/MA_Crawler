/* eslint-disable no-invalid-this */
const GitHubAPICrawler = require('./GitHubAPICrawler');

class GenericCrawler {
  constructor(type) {
    switch (type) {
      case 'GitHubAPI':
        this.strategy = new GitHubAPICrawler();
        break;
      default:
        this.strategy = new GitHubAPICrawler();
    }
  }

  async crawl(data) {
    return await this.strategy.crawl(data);
  }
}

module.exports = GenericCrawler;
