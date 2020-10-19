const { config, setGitHub } = require('./../../../config');
const socket = require('socket.io-client')(config.MASTER_SOCKET);
const axios = require('axios').default;
const gCrawler = require('./../../crawler/GenericCrawler');
const gProcessor = require('./../../processor/GenericProcessor');
const logger = require('./../../../logger');

socket.on('connect', () => {
  logger.info('connected');
});
socket.on('event', (data) => {
  logger.info(data);
});
socket.on('github', (data) => {
  data = JSON.parse(data);
  setGitHub(data.username, data.token);
});

socket.on('crawl', async (data) => {
  const pData = JSON.parse(data);
  logger.info(`crawl: ${JSON.stringify(pData)}`);

  const crawler = new gCrawler(pData.crawler);
  const processor = new gProcessor(pData.crawler);
  const start = pData.beginning;
  const end = pData.ending;

  for (let i = start; i <= end; i++) {
    let res = await crawler.crawl({
      term: pData.term,
      size: i
    });

    socket.emit('status', JSON.stringify({
      node: socket.id,
      start,
      end,
      progress: i
    }));

    let res2 = await processor.batchProcess(res);

    socket.emit('result', JSON.stringify(res2));
  }

});

socket.on('disconnect', () => {});
