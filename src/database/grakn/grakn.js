const GraknClient = require('grakn-client');
const config = require('../../../config');
const template = require('./templates/index');

class Grakn {

  constructor(keyspace) {
    this.keyspace = keyspace;
    this.client = null;
    this.session = null;
  }

  async openSession () {
    this.client = new GraknClient(config.graknURI);
    this.session = await client.session(this.keyspace);   
  };

  async closeSession() {
    await this.session.close();
    this.client.close();
  }

  async insertTemplate(item, type) {
    const transaction = await this.session.transaction().write();
    const graqlInsertQuery = template(type)(item);
    await transaction.query(graqlInsertQuery);
    await transaction.commit();
  }

  async runQuery(query, searchTarget) {
    const transaction = await this.session.transaction().read();
    const iterator = await transaction.query(query);
    const answers = await iterator.collect();

    const result = await Promise.all(
        answers.map(answer =>
            answer.map()
                  .get(searchTarget)
                  .value()
        )
    );

    await transaction.close();

    return result;
  }

}

module.exports = Grakn;
