'use strict';
const path = require('path');
const http = require('http');
const fs = require('fs-extra');
const download = require('download');
const logger = require('./logger');

const fetchUrl = uri => new Promise((resolve, reject) => {
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
  // 超时操作
  request.setTimeout(3000, () => {
    // handle timeout here
    reject(new Error(`request '${uri} timeout! '`));
  });
});

const cacheRoot = path.resolve(__dirname, '../../cache/');
const fetchFile = (uri, filename, progress) => new Promise((resolve, reject) => {
  download({ extract: true, mode: '755' })
    .get(uri)
    // 输出到下载缓存目录
    .dest(cacheRoot)
    // 监视下载进度
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
    // .rename(`../${filename}.asar`)
    .run((error, files) => {
      if (error) {
        // console.log(`Got file error: ${error.message}`);
        reject(error);
      } else {
        const to = path.resolve(cacheRoot, `../${filename}.asar`);
        fs.move(files[0].path, to, { clobber: true }, error => {
          if (error)
            reject(error);
          else
            resolve(to);
        });
      }
    });
});

module.exports = { fetchUrl, fetchFile };
