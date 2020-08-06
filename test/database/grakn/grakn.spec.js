const Grakn = require('./../../../src/database/grakn/grakn');
const chai = require('chai');
const expect = chai.expect;

const timestamp = new Date().getTime();

describe('Grakn Queries', () => {
  beforeEach(() => {
    this.grakn = new Grakn('docker');
  });

  it('should have a keyspace defined', async (done) => {
    expect(this.grakn.keyspace).to.equal('docker');
    done();
  });

  it('should open a session', async () => {
    await this.grakn.openSession();
    expect(this.grakn.client).to.not.be.null;
    expect(this.grakn.session).to.not.be.null;
  });

  it('should close a session', async () => {
    await this.grakn.openSession();
    expect(this.grakn.client).to.not.be.null;
    expect(this.grakn.session).to.not.be.null;
    await this.grakn.closeSession();
  });

  it('should insert a user entity', async () => {
    await this.grakn.openSession();
    await this.grakn.insertTemplate(user, 'user');
    const result = await this.grakn.runQuery('match $user isa user, has name $name, has rid $rid, has platform $platform; get; limit 10;');
    await this.grakn.closeSession();

    expect(result).to.not.have.lengthOf(0);
    expect(result[0].name).to.equal(user.name);
    expect(result[0].platform).to.equal(user.platform);
  }).timeout(10000);

  it('should insert a service entity', async () => {
    await this.grakn.openSession();
    await this.grakn.insertTemplate(service, 'service');
    const result = await this.grakn.runQuery('match $service isa service, has name $name, has rid $rid, has rtype $rtype, has metadata $metadata, has version $version, has image $image; get; limit 10;');
    await this.grakn.closeSession();

    expect(result).to.not.have.lengthOf(0);
    expect(result[0].name).to.equal(service.name);
    expect(result[0].rtype).to.equal(service.type);
    expect(result[0].version).to.equal(service.version);
    expect(result[0].image).to.equal(service.image);
  }).timeout(10000);

  it('should insert a repo entity', async () => {
    await this.grakn.openSession();
    await this.grakn.insertTemplate(repo, 'repo');
    const result = await this.grakn.runQuery('match $repository isa repository, has name $name, has rid $rid, has fork $fork, has description $description; get; limit 10;');
    await this.grakn.closeSession();

    expect(result).to.not.have.lengthOf(0);
    expect(result[0].name).to.equal(repo.name);
    expect(result[0].fork).to.equal(repo.fork);
    expect(result[0].description).to.equal(repo.description);
  }).timeout(10000);

  it('should insert a deployment entity', async () => {
    await this.grakn.openSession();
    await this.grakn.insertTemplate(deployment, 'deployment');
    const result = await this.grakn.runQuery('match $deployment isa deployment, has name $name, has rid $rid, has rtype $rtype, has rawUrl $rawUrl, has executable $executable, has score $score, has version $version; get; limit 10;');
    await this.grakn.closeSession();

    expect(result).to.not.have.lengthOf(0);
    expect(result[0].name).to.equal(deployment.name);
    expect(result[0].rtype).to.equal(deployment.type);
    expect(result[0].rawUrl).to.equal(deployment.rawUrl);
    expect(result[0].executable).to.equal(deployment.executable);
    expect(result[0].version).to.equal(deployment.version);
    expect(result[0].score).to.equal(deployment.score);
  }).timeout(10000);

  it('should insert a contain relation', async () => {
    await this.grakn.openSession();
    await this.grakn.insertTemplate(contain, 'contain');
    const result = await this.grakn.runQuery(`match $id isa contain; get; limit 10;`);
    await this.grakn.closeSession();

    expect(result).to.not.have.lengthOf(0);
  }).timeout(10000);

  it('should insert a depend relation', async () => {
    await this.grakn.openSession();
    await this.grakn.insertTemplate(serviceB, 'service');
    await this.grakn.insertTemplate(depend, 'depend');
    const result = await this.grakn.runQuery(`match $id isa depend; get; limit 10;`);
    await this.grakn.closeSession();

    expect(result).to.not.have.lengthOf(0);
  }).timeout(10000);

  it('should insert a include relation', async () => {
    await this.grakn.openSession();
    await this.grakn.insertTemplate(include, 'include');
    const result = await this.grakn.runQuery(`match $id isa include; get; limit 10;`);
    await this.grakn.closeSession();

    expect(result).to.not.have.lengthOf(0);
  }).timeout(10000);

  it('should insert a own relation', async () => {
    await this.grakn.openSession();
    await this.grakn.insertTemplate(own, 'own');
    const result = await this.grakn.runQuery(`match $id isa own; get; limit 10;`);
    await this.grakn.closeSession();

    expect(result).to.not.have.lengthOf(0);
  }).timeout(10000);


  it('should throw an error due to not implemented', async () => {
    await this.grakn.openSession();
    try {
      await this.grakn.insertTemplate({}, 'err');
    } catch(e) {
      
    }
    await this.grakn.closeSession();
  }).timeout(10000);
});


const user = {
  id: `user-${timestamp}`,
  name: 'grakular',
  platform: 'github'
};

const service = {
  rid: `serviceA-${timestamp}`,
  name: 'grakn',
  type: 'docker',
  metadata: '{"bla": "bla"}',
  version: '3',
  image: 'grakn/something'
};

const serviceB = {
  rid: `serviceB-${timestamp}`,
  name: 'grail',
  type: 'docker',
  metadata: '{"bla": "bla"}',
  version: '2',
  image: 'grakn/somethingelse'
};

const repo = {
  id: `repo-${timestamp}`,
  name: 'example',
  fork: false,
  description: 'bla bla'
};

const deployment = {
  id: `deployment-${timestamp}`,
  type: 'github',
  rawUrl: 'https://',
  name: 'example',
  executable: -1,
  version: '123',
  score: -1
};

const contain = {
  repoId: repo.id,
  deploymentId: deployment.id
};

const own = {
  userId: user.id,
  repoId: repo.id
};

const depend = {
  serviceA: service.rid,
  serviceB: serviceB.rid
};

const include = {
  deploymentId: deployment.id,
  serviceId: service.rid
};
