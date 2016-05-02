const http = require('http');

module.exports = uri => new Promise((resolve, reject) => {
  http.get(uri, res => {
    console.log(`Got response: ${res.statusCode}`);
    // consume response body
    res.setEncoding('utf8');
    const contents = [];
    res.on('data', chunk => {
      // console.log(`BODY: ${chunk}`);
      contents.push(chunk);
    }).on('end', () => {
      // console.log('No more data in response.')
      resolve(contents.join(''));
    }).on('error', e => {
      reject(e);
      console.log(`Got error: ${e.message}`);
    });
    res.resume();
  }).on('error', e => {
    reject(e);
    console.log(`Got error: ${e.message}`);
  });
});
