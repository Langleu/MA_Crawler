
const Grakn = require('./../../database/grakn/grakn');
const db = new Grakn('docker');

module.exports = (io) => {
  io.on('connection', (socket) => { 
    socket.emit('event', 'test');

    // Playground to target single sockets
    io.sockets.sockets[Object.keys(io.sockets.sockets)[0]].emit('event', 'test2');
    console.log(Object.keys(io.sockets.sockets));

    socket.on('disconnect', (reason) => {
          console.log(Object.keys(io.sockets.sockets));
    });

    socket.on('status', (status) => {
        status = JSON.parse(status);
        console.log(status);
    });

    socket.on('result', async (result) => {
      result = JSON.parse(result);

      console.log('inserting into db');
      await db.openSession();

      for (const e of result) {
        console.log(e);
        console.log('inserting entry');
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
        await db.insertTemplate(e.owns, 'own');
        await db.insertTemplate(e.contains, 'contain');
        for (const r of e.includes) {
          await db.insertTemplate(r, 'include');
        };
        for (const r of e.depends_on) {
          await db.insertTemplate(r, 'depend');
        };
      };
      
      await db.closeSession();
      //console.log(result);
      // TODO: insert into Database
    });
  });
}
