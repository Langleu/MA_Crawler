const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  server
} = require('./../../../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Processor routes', () => {
  after(() => {
    server.close();
  });

  it('should return an array of available processors', (done) => {
    chai
      .request(server)
      .get('/v1/process')
      .end((err, res) => {
        text = JSON.parse(res.text);
        expect(res).to.have.status(200);
        expect(text.availableProcessors).to.not.have.lengthOf(0);
        done();
      });
  });

  it('should not be able to process - no processor supplied', (done) => {
    chai
      .request(server)
      .post('/v1/process')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.equal('processor not implemented!');
        done();
      });
  });

  it('should not be able to process - wrong processor supplied', (done) => {
    chai
      .request(server)
      .post('/v1/process')
      .type('form')
      .send({
        'processor': 'ABCDEFGH'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.equal('processor not implemented!');
        done();
      });
  });

  it('should be able to process - GitHubAPI', (done) => {
    chai
      .request(server)
      .post('/v1/process')
      .type('form')
      .send({
        processor: 'GitHubAPI',
        items: exampleData.items
      })
      .end((err, res) => {
        text = JSON.parse(res.text)[0];
        expect(res).to.have.status(200);
        expect(text.user.id).to.equal('46494578');
        expect(text.user.name).to.equal('WavyWalk');
        expect(text.repository.id).to.equal('253281837');
        expect(text.repository.name).to.equal('simplertemplateapp');
        expect(text.repository.fork).to.equal('false');
        expect(text.repository.description).to.equal('');
        expect(text.deployment.type).to.equal('docker-compose');
        expect(text.deployment.name).to.equal('docker-compose.docker.yaml');
        expect(text.deployment.id).to.equal('34986797cf148a258b32ec67402b7f60cf2d6cc3');
        expect(text.deployment.executable).to.equal(-1);
        expect(text.deployment.score).to.equal(-1);
        expect(text).to.contain.keys('deployment', 'services', 'includes', 'depends_on', 'user', 'repository')
        done();
      });
  }).timeout(5000);

  it('should be able to process - Compose - url', (done) => {
    chai
      .request(server)
      .post('/v1/process')
      .type('form')
      .send({
        processor: 'Compose',
        sha: '34986797cf148a258b32ec67402b7f60cf2d6cc3',
        url: 'https://github.com/WavyWalk/simplertemplateapp/blob/dc1908c28f7f2d85541c21f745215e9f5e8ba265/docker-compose.docker.yaml'
      })
      .end((err, res) => {
        text = JSON.parse(res.text);
        expect(res).to.have.status(200);
        expect(text.deployment.type).to.equal('docker-compose');
        expect(text.deployment.name).to.equal('docker-compose.docker.yaml');
        expect(text.deployment.id).to.equal('34986797cf148a258b32ec67402b7f60cf2d6cc3');
        expect(text.deployment.executable).to.equal(-1);
        expect(text.deployment.score).to.equal(-1);
        expect(text).to.contain.keys('deployment', 'services', 'includes', 'depends_on')
        done();
      });
  }).timeout(5000);

  it('should be able to process - Compose - data', (done) => {
    chai
      .request(server)
      .post('/v1/process')
      .type('form')
      .send({
        processor: 'Compose',
        sha: '34986797cf148a258b32ec67402b7f60cf2d6cc3',
        rawFile: rawData
      })
      .end((err, res) => {
        text = JSON.parse(res.text);
        expect(res).to.have.status(200);
        expect(text.deployment.type).to.equal('docker-compose');
        expect(text.deployment.name).to.equal('rawFile supplied');
        expect(text.deployment.id).to.equal('34986797cf148a258b32ec67402b7f60cf2d6cc3');
        expect(text.deployment.executable).to.equal(-1);
        expect(text.deployment.score).to.equal(-1);
        expect(text).to.contain.keys('deployment', 'services', 'includes', 'depends_on')
        done();
      });
  }).timeout(5000);

  it('should not be able to process - Compose - wrong yaml', (done) => {
    chai
      .request(server)
      .post('/v1/process')
      .type('form')
      .send({
        processor: 'Compose',
        sha: '34986797cf148a258b32ec67402b7f60cf2d6cc3',
        rawFile: faultyData
      })
      .end((err, res) => {
        expect(res).to.have.status(204);
        expect(res.text).to.equal('');
        done();
      });
  }).timeout(5000);

  it('should not be able to process - Compose - no sha supplied', (done) => {
    chai
      .request(server)
      .post('/v1/process')
      .type('form')
      .send({
        processor: 'Compose',
        rawFile: faultyData
      })
      .end((err, res) => {
        expect(res).to.have.status(204);
        expect(res.text).to.equal('');
        done();
      });
  }).timeout(5000);
});

const faultyData = `
backend:
    image: openjdk:10
  build:
    context: ./
    dockerfile: ./docker/backend/Dockerfile
`

const rawData = `
backend:
  image: openjdk:10
  build:
    context: ./
    dockerfile: ./docker/backend/Dockerfile
  ports:
    - 8085:8085
    - 5005:5005
  volumes:
    - ./build/libs:/app
    - ./migrations:/app/migrations
    - ./src/public:/app/public
  command: java -agentlib:jdwp=transport=dt_socket,address=*:5005,server=y,suspend=n -jar /app/food-1.0-SNAPSHOT-all.jar
  links:
    - db
  environment:
    - RAILS_ENV=dev
    - APP_ENV=devdocker

db:
  image: postgres:12.2
  environment:
    - POSTGRES_PASSWORD=root
    - POSTGRES_USER=root
    - POSTGRES_DB=foodlovers
  volumes:
    - ./docker/pg/data:/var/lib/postgresql/data
  ports:
    - 5432:5432

proxy:
  image: nginx
  ports:
    - 80:80
  volumes:
    - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    - ./docker/nginx/proxydocker.conf:/etc/nginx/conf.d/default.conf:ro
  depends_on:
    - backend
    - frontend

frontend:
  image: node:10
  ports:
    - '3000:3000'
    - '9230:9229'
  volumes:
    - './frontend:/home/frontend'
  working_dir: /home/frontend
  command: npm run dev
  environment:
    - NODE_ENV=developement
`

const exampleData = {
    "processor": 'GitHubAPI',
    "total_count": 90371,
    "incomplete_results": false,
    "items": [
        {
            "name": "docker-compose.docker.yaml",
            "path": "docker-compose.docker.yaml",
            "sha": "34986797cf148a258b32ec67402b7f60cf2d6cc3",
            "url": "https://api.github.com/repositories/253281837/contents/docker-compose.docker.yaml?ref=dc1908c28f7f2d85541c21f745215e9f5e8ba265",
            "git_url": "https://api.github.com/repositories/253281837/git/blobs/34986797cf148a258b32ec67402b7f60cf2d6cc3",
            "html_url": "https://github.com/WavyWalk/simplertemplateapp/blob/dc1908c28f7f2d85541c21f745215e9f5e8ba265/docker-compose.docker.yaml",
            "repository": {
                "id": 253281837,
                "node_id": "MDEwOlJlcG9zaXRvcnkyNTMyODE4Mzc=",
                "name": "simplertemplateapp",
                "full_name": "WavyWalk/simplertemplateapp",
                "private": false,
                "owner": {
                    "login": "WavyWalk",
                    "id": 46494578,
                    "node_id": "MDQ6VXNlcjQ2NDk0NTc4",
                    "avatar_url": "https://avatars1.githubusercontent.com/u/46494578?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/WavyWalk",
                    "html_url": "https://github.com/WavyWalk",
                    "followers_url": "https://api.github.com/users/WavyWalk/followers",
                    "following_url": "https://api.github.com/users/WavyWalk/following{/other_user}",
                    "gists_url": "https://api.github.com/users/WavyWalk/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/WavyWalk/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/WavyWalk/subscriptions",
                    "organizations_url": "https://api.github.com/users/WavyWalk/orgs",
                    "repos_url": "https://api.github.com/users/WavyWalk/repos",
                    "events_url": "https://api.github.com/users/WavyWalk/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/WavyWalk/received_events",
                    "type": "User",
                    "site_admin": false
                },
                "html_url": "https://github.com/WavyWalk/simplertemplateapp",
                "description": null,
                "fork": false,
                "url": "https://api.github.com/repos/WavyWalk/simplertemplateapp",
                "forks_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/forks",
                "keys_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/teams",
                "hooks_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/hooks",
                "issue_events_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/issues/events{/number}",
                "events_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/events",
                "assignees_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/assignees{/user}",
                "branches_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/branches{/branch}",
                "tags_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/tags",
                "blobs_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/languages",
                "stargazers_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/stargazers",
                "contributors_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/contributors",
                "subscribers_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/subscribers",
                "subscription_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/subscription",
                "commits_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/issues/comments{/number}",
                "contents_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/contents/{+path}",
                "compare_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/merges",
                "archive_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/downloads",
                "issues_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/issues{/number}",
                "pulls_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/labels{/name}",
                "releases_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/releases{/id}",
                "deployments_url": "https://api.github.com/repos/WavyWalk/simplertemplateapp/deployments"
            },
            "score": 1.0
        }
    ]
}
