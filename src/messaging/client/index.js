const socket = require('socket.io-client')('http://localhost:8000');
const axios = require('axios').default;
const gCrawler = require('./../../crawler/GenericCrawler');
const gProcessor = require('./../../processor/GenericProcessor');

socket.on('connect', () => {
  console.log('connected');
});
socket.on('event', (data) => {
  console.log(data);
});

socket.on('crawl', async (data) => {
  let pData = JSON.parse(data);
  console.log(`crawl: ${JSON.stringify(pData)}`);

  let crawler = new gCrawler(pData.crawler);
  let processor = new gProcessor(pData.crawler);
  let res = await crawler.crawl({
    term: pData.term,
    size: 105
  });

  let res2 = await processor.batchProcess(res);
  console.log(res2);

  // TODO: call up /crawl with axios and page 1,2,3... sent result to processing or return to master.
});

socket.on('disconnect', () => {
  // save progress
  // either on process SIGINT or exit  
});