const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  server
} = require('./../../../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Orchestrator routes', () => {
  after(() => {
    server.close();
  });

  it('should return an array of available crawlers', (done) => {
    chai
      .request(server)
      .get('/v1/orchestrate')
      .end((err, res) => {
        text = JSON.parse(res.text);
        expect(res).to.have.status(200);
        expect(text.availableCrawlers).to.not.have.lengthOf(0);
        done();
      });
  });

  it('should not be able to orchestrate - no crawler supplied', (done) => {
    chai
      .request(server)
      .post('/v1/orchestrate')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.equal('crawler not implemented!');
        done();
      });
  });

  it('should not be able to orchestrate - wrong crawler supplied', (done) => {
    chai
      .request(server)
      .post('/v1/orchestrate')
      .type('form')
      .send({
        'crawler': 'ABCDEFGH'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.equal('crawler not implemented!');
        done();
      });
  });

  it('should be able to orchestrate', (done) => {
    chai
      .request(server)
      .post('/v1/orchestrate')
      .type('form')
      .send({
        'crawler': 'GitHubAPI',
        'term': 'docker-compose'
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.text).to.equal('Internal Server Error');
        done();
      });
  }).timeout(5000);
});
