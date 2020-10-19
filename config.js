let GitHubAccounts = [];
try {
  GitHubAccounts = JSON.parse(process.env.GITHUBACCOUNTS);
} catch (err) {}

var GitHubToken = 'test';
var GitHubUsername = 'test';

var config = {
  'GitHubAccounts': GitHubAccounts,
  'port': process.env.PORT || '8000',
  'type': process.env.TYPE || 'client',
  'graknURI': process.env.GRAKNURI || 'localhost:48555',
  'Sentry': process.env.SENTRY || '',
  'MASTER_SOCKET': process.env.MASTER_SOCKET || 'http://localhost:8000'
};

const setGitHub = (username, token) => {
  GitHubToken = token;
  GitHubUsername = username;
}

const getGitHub = () => {
  return { token: GitHubToken, username: GitHubUsername };
}

module.exports = { config, setGitHub, getGitHub };
