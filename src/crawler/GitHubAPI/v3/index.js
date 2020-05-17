const axios = require('axios').default;
const assert = require('assert');
const config = require('./../../../../config');

assert(config.GitHubToken);
assert(config.GitHubUsername);

const baseUrl = 'https://api.github.com';
const headers = {
  'Accept': 'application/vnd.github.v3+json',
  'Authorization': `token ${config.GitHubToken}`,
  'User-Agent': config.GitHubUsername,
};

let rateLimitRemaining = -1;

class GitHub {
  constructor() {}

  // 30 req per minute (authenticated)
  // 10 req per minute unauthenticated)
  // TODO: check why total count is only 20k compared to postman with 800k
  async searchCode(term, page) {
    const res = await axios({
      method: 'get',
      url: `${baseUrl}/search/code`,
      headers: headers,
      params: {
        q: `fileName:${term}`,
        page: page,
        per_page: 100,
      },
    });

    rateLimitRemaining = res.headers['x-ratelimit-remaining'];

    return res.data;
  }
}

module.exports = GitHub;
