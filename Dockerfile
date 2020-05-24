FROM node:12-stretch-slim

RUN mkdir /home/node/app/ && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN npm install && npm cache clean --force --loglevel=error

COPY --chown=node:node app.js .
COPY --chown=node:node config.js .
COPY --chown=node:node src ./src/

CMD [ "node", "app.js"]
