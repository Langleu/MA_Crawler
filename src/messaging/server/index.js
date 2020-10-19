
const Grakn = require('./../../database/grakn/grakn');
const logger = require('./../../../logger');
const db = new Grakn('docker');
const config = require('./../../../config').config;

module.exports = (io) => {
  io.on('connection', (socket) => {     
    socket.emit('github', `${JSON.stringify(config.GitHubAccounts[Object.keys(io.sockets.sockets).length - 1])}`);

    logger.info(Object.keys(io.sockets.sockets));

    socket.on('disconnect', (reason) => {
          logger.info(Object.keys(io.sockets.sockets));
    });

    socket.on('status', (status) => {
        status = JSON.parse(status);
        logger.info(status);
    });

    socket.on('result', async (result) => {
      result = JSON.parse(result);

      logger.info('inserting into db');
      await db.openSession();

      for (const e of result) {
        logger.info(e);
        logger.info('inserting entry');
        if (!e) return;
        // user, owns, repository, contains, deployment, includes, services, depends_on
        // Entities
        await db.insertTemplate(e.user, 'user');
        await db.insertTemplate(e.repository, 'repo');
        await db.insertTemplate(e.deployment, 'deployment');
        for (const r of e.services) {
          await db.insertTemplate(r, 'service');
        };

        // Relations
        await db.insertTemplate(e.owns[0], 'own');
        await db.insertTemplate(e.contains[0], 'contain');
        for (const r of e.includes) {
          await db.insertTemplate(r, 'include');
        };
        for (const r of e.depends_on) {
          await db.insertTemplate(r, 'depend');
        };
      };
      
      await db.closeSession();
    });
  });
}
