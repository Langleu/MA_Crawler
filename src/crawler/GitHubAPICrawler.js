/* eslint-disable no-invalid-this */
const GenericStrategy = require('./GenericStrategy');
const GitHubAPI = require('./GitHubAPI/v3/index');

class GitHubAPICrawler extends GenericStrategy {
  constructor() {
    super();

    this.gapi = new GitHubAPI();
  }

  async crawl(data) {
    return await this.gapi.searchCode(data.term, data.page);
  }
}

module.exports = GitHubAPICrawler;
