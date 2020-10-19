const GraknClient = require('grakn-client');
const config = require('../../../config').config;
const template = require('./templates/index');

class Grakn {

  constructor(keyspace) {
    this.keyspace = keyspace;
    this.client = null;
    this.session = null;
  }

  async openSession () {
    this.client = new GraknClient(config.graknURI);
    this.session = await this.client.session(this.keyspace);
  };

  async closeSession() {
    await this.session.close();
    this.client.close();
  }
  
  async insertTemplate(item, type) {
    const transaction = await this.session.transaction().write();
    const graqlInsertQuery = template(type)(item);
    try {
      await transaction.query(graqlInsertQuery);
      await transaction.commit();
    } catch(e) {
      // catch duplicate creation
    }
  }

  toJson(query, answers) {
    const results = [];
    let split = query.split(';')[0].split(',');
    // first entry = entity, rest is attributes
    split = split.map(s => {
      return s.match(/\$\w*/)[0].replace('$', '');
    });

    let obj = {};
    answers.forEach(e => {
      if (e.baseType == 'ENTITY')
        obj.id = e.id;
      else
        obj[e._type._label] = e._value
      results.push(obj);
    });

    return results;
  }

  async runQuery(query) {
    const transaction = await this.session.transaction().read();
    const iterator = await transaction.query(query);
    const answers = await iterator.collectConcepts();
    
    await transaction.close();

    return this.toJson(query, answers);
  }

}

module.exports = Grakn;
