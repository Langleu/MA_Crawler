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
  // 10 req per minute (unauthenticated)
  async searchCode(term, page, size) {
    const res = await axios({
      method: 'get',
      url: `${baseUrl}/search/code`,
      headers: headers,
      params: {
        q: `fileName:${term}`,
        page: page,
        per_page: 100,
        size: size,
        order: 'asc', // asc or desc, ignored if sort not defined
        sort: 'indexed', // only option is indexed, if null then best match is applied
      },
    });

    rateLimitRemaining = res.headers['x-ratelimit-remaining'];

    return res.data;
  }
}

module.exports = GitHub;
