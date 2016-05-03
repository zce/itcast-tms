'use strict';
const http = require('http');
const download = require('download');

const fetchUrl = exports.fetchUrl = uri => new Promise((resolve, reject) => {
  http.get(uri, res => {
    // console.log(`Got response: ${res.statusCode}`);
    // if(res.statusCode !== )
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

const fetchFile = exports.fetchFile = (uri, progress) => new Promise((resolve, reject) => {
  download({ extract: true })
    .get(uri)
    .dest('../cache/')
    .use((res, uri, next) => {
      if (!res.headers['content-length']) {
        next();
        return;
      }
      const total = parseInt(res.headers['content-length'], 10);
      let current = 0;
      res.on('data', chunk => progress((current += chunk.length) / total));
      res.on('end', () => next());
    })
    // .rename('./updater')
    .run((error, files) => {
      if (error) reject(error);
      else resolve(files[0]);
    });
});
