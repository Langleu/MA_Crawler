const axios = require('axios').default;
const cheerio = require('cheerio');

class GitHubWebCrawler extends GenericStrategy {
  constructor() {
    super();
  }

  async crawl(data) {
    // ...
  }
}

module.exports = GitHubWebCrawler;
