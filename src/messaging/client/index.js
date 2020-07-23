const socket = require('socket.io-client')('http://localhost:8000');
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

socket.on('crawl', async (data) => {
  const pData = JSON.parse(data);
  logger.info(`crawl: ${JSON.stringify(pData)}`);

  const crawler = new gCrawler(pData.crawler);
  const processor = new gProcessor(pData.crawler);
  const start = pData.beginning;
  const end = pData.ending;

  for (i = start; i <= end; i++) {
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

  // TODO: call up /crawl with axios and page 1,2,3... sent result to processing or return to master.
});

socket.on('disconnect', () => {
  // save progress
  // either on process SIGINT or exit  
});