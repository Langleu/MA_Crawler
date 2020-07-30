const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  server
} = require('./../../../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Crawler routes', () => {
  after(() => {
    server.close();
  });

  it('should return an array of available crawlers', (done) => {
    chai
      .request(server)
      .get('/v1/crawl')
      .end((err, res) => {
        text = JSON.parse(res.text);
        expect(res).to.have.status(200);
        expect(text.availableCrawlers).to.not.have.lengthOf(0);
        done();
      });
  });

  it('should not be able to crawl - no crawler supplied', (done) => {
    chai
      .request(server)
      .post('/v1/crawl')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.equal('crawler not implemented!');
        done();
      });
  });

  it('should not be able to crawl - wrong crawler supplied', (done) => {
    chai
      .request(server)
      .post('/v1/crawl')
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

  it('should be able to crawl', (done) => {
    chai
      .request(server)
      .post('/v1/crawl')
      .type('form')
      .send({
        'crawler': 'GitHubAPI',
        'term': 'docker-compose',
        'page': 0
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);
});
