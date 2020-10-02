const config = {
  'GitHubToken': process.env.GitHubToken || 'test',
  'GitHubUsername': process.env.GitHubUsername || 'test',
  'port': process.env.PORT || '8000',
  'type': process.env.TYPE || 'client',
  'graknURI': process.env.GRAKNURI || 'localhost:48555',
  'Sentry': process.env.SENTRY || '',
  'MASTER_SOCKET': process.env.MASTER_SOCKET || 'localhost:8000'
};

module.exports = config;
