'use strict';
const path = require('path');
const http = require('http');
const download = require('download');

const fetchUrl = exports.fetchUrl = uri => new Promise((resolve, reject) => {
  // console.time('utils');
  const request = http.get(uri, res => {
    // console.log(`Got response: ${res.statusCode}`);
    // if(res.statusCode !== )
    // consume response body
    res.setEncoding('utf8');
    const contents = [];
    res.on('data', chunk => {
      // console.log(`BODY: ${chunk}`);
      contents.push(chunk);
    }).on('end', () => {
      // console.timeEnd('utils');
      // console.log('No more data in response.')
      resolve(contents.join(''));
    }).on('error', reject);
    res.resume();
  }).on('error', reject);
  request.setTimeout(3000, () => {
    // handle timeout here
    reject(new Error('request timeout...'));
  });
});

const fetchFile = exports.fetchFile = (uri, progress) => new Promise((resolve, reject) => {
  download({ extract: true, mode: '755' })
    .get(uri)
    .dest(path.resolve(__dirname, '../cache/'))
    .use((res, uri, next) => {
      if (!res.headers['content-length']) {
        next();
        return;
      }
      const total = parseInt(res.headers['content-length'], 10);
      let current = 0;
      res.on('data', chunk => progress && progress((current += chunk.length) / total));
      res.on('end', () => next());
    })
    // .rename(filename)
    .run((error, files) => {
      if (error) {
        console.log(`Got file error: ${error.message}`);
        reject(error);
      } else {
        resolve(files[0]);
      }
    });
});
