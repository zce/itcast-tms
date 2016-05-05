var crypto = require('crypto');
var fs = require('fs');

//读取一个Buffer
//
console.time('read');
var buffer = fs.readFileSync('./updater.asar');
var fsHash = crypto.createHash('sha1');

fsHash.update(buffer);
var md5 = fsHash.digest('hex');
console.log('文件的MD5是：%s', md5);
console.timeEnd('read');



console.time('read1');
var buffer2 = fs.readFileSync('./demo.asar');
var fsHash2 = crypto.createHash('sha1');

fsHash2.update(buffer2);
var md52 = fsHash2.digest('hex');
console.log('文件的MD5是：%s', md52);
console.timeEnd('read1');
