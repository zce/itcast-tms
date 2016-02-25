'use strict';

// const index = require('./index');
// index.update((p) => { console.log(p); }, () => {
//   console.log('ok');
// });

const fs = require('fs');
const path = require('path');
const wget = require('wget');

let tmpFile = path.join(__dirname, '../cache/t.txt');
let download = wget.download('http://m.baidu.com', tmpFile);
download.on('error', () => {
  console.log('error');
  fs.exists(tmpFile, (e) => { e && fs.unlink(tmpFile); });
});
download.on('end', () => {
  console.log('end');
  fs.exists(tmpFile, (e) => { e && fs.unlink(tmpFile); });
});