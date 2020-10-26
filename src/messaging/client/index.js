const { config, setGitHub, gitHubCreds } = require('./../../../config');
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
  let page_end = 10;

  for (let i = start; i <= end; i++) {
    for (let j = 1; j <= page_end; j++) {
      let res = await crawler.crawl({
        term: pData.term,
        page: j,
        size: i
      });

      if (res.total_count >= 900) {
        page_end = 10;
      } else if (res.total_count <= 100) {
        page_end = 1;
      } else {
        page_end = Math.ceil(res.total_count / 100);
      }

      socket.emit('status', JSON.stringify({
        node: socket.id,
        start,
        end,
        progress: i,
        page: j
      }));

      let res2 = await processor.batchProcess(res);

      socket.emit('result', JSON.stringify(res2));
    }
    page_end = 10;
  }

});

socket.on('disconnect', () => {});
