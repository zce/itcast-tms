const fs = require('fs');
const path = require('path');
const options = require('../config');

// ===== 目录不存在 则创建 =====
fs.existsSync(options.storage_root) || fs.mkdir(options.storage_root);
// fs.existsSync(options.temp_root) || fs.mkdir(options.temp_root);


function write(uri, value) {
  value = JSON.stringify(value);
  const length = Buffer.byteLength(value); // new Buffer(value).length;
  const buffer = new Buffer(length + 4);
  buffer.writeUInt32BE(length, 0);
  buffer.write(value, 4);
  fs.writeFileSync(uri, buffer, 'hex');
};

function read(uri) {
  try {
    const buffer = fs.readFileSync(uri);
    const length = buffer.readUInt32BE(0);
    const content = buffer.toString('utf8', 4, length + 4);
    return JSON.parse(content);
  } catch (e) {
    // console.info('read file ' + e);
    return null;
  }
};

function set(stamp, value) {
  write(path.join(options.storage_root, stamp + options.storage_ext), value);
};

function get(stamp) {
  return read(path.join(options.storage_root, stamp + options.storage_ext));
};

function watch(stamp, callback) {
  fs.watchFile(path.join(options.storage_root, stamp + options.storage_ext), { interval: 500 }, (curr, prev) => {
    // console.log(curr);
    if (curr && curr.size && curr.mtime !== prev.mtime) {
      const data = get(stamp);
      data && callback(data);
      // console.log(`『${stamp}』 changed`);
    }
  });
}

module.exports = { set: set, get: get, watch: watch };
