const chai = require('chai');
const chaiHttp = require('chai-http');
const {server} = require('../../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Basic routes', () => {
  after(() => {
    server.close();
  });

  it('should get default', (done) => {
    chai
        .request(server)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).equal('default');
          done();
        });
  });
});
