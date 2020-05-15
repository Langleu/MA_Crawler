const config = {
  'GitHubToken': process.env.GitHubToken || 'test',
  'GitHubUsername': process.env.GitHubUsername || 'test',
  'port': process.env.PORT || '8000',
  'type': process.env.TYPE || 'client',
};

module.exports = config;
