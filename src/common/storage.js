const fs = require('fs');
const path = require('path');
const options = require('../config');

function resolve(uri) {
  return uri;
}

function write(uri, value) {
  value = JSON.stringify(value);
  const length = Buffer.byteLength(value); // new Buffer(value).length;
  const buffer = new Buffer(length + 4);
  buffer.writeUInt32BE(length, 0);
  buffer.write(value, 4);
  fs.writeFileSync(resolve(uri), buffer, 'hex');
};

function read(uri) {
  try {
    const buffer = fs.readFileSync(resolve(uri));
    const length = buffer.readUInt32BE(0);
    const content = buffer.toString('utf8', 4, length + 4);
    return JSON.parse(content);
  } catch (e) {
    console.info('read file ' + e);
    return null;
  }
};

function set(stamp, value) {
  this.write(path.resolve(options.storage_root, stamp + options.storage_ext), value);
};

function get(stamp) {
  return this.read(path.resolve(options.storage_root, stamp + options.storage_ext));
};

module.exports = { write, read, set, get };
