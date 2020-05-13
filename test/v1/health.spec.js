const chai = require('chai');
const chaiHttp = require('chai-http');
const {server} = require('./../../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Health routes', () => {
  after(() => {
    server.close();
  });

  it('should get health ok!', (done) => {
    chai
        .request(server)
        .get('/v1/health')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).contain('ok');
          done();
        });
  });
});
