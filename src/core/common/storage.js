const fs = require('fs')
const path = require('path')
const options = require('../config')
const suffix = `© ${new Date().getFullYear()} WEDN.NET`
const suffixLength = Buffer.byteLength(suffix)

// ===== 目录不存在 则创建 =====
fs.existsSync(options.storage_root) || fs.mkdir(options.storage_root)
// fs.existsSync(options.temp_root) || fs.mkdir(options.temp_root)

function write (uri, value) {
  value = JSON.stringify(value)
  value = value.split('').reverse().join('')
  const length = Buffer.byteLength(value)
  const buffer = Buffer.alloc(4 + length + suffixLength)
  buffer.writeUInt32BE(length, 0)
  buffer.write(value, 0 + 4)
  buffer.write(suffix, 0 + 4 + length)
  fs.writeFileSync(uri, buffer, 'binary')
}

function read (uri) {
  try {
    const buffer = fs.readFileSync(uri)
    const length = buffer.readUInt32BE(0)
    const content = buffer.toString('utf8', 0 + 4, 0 + 4 + length)
    // console.log(buffer.toString())
    return JSON.parse(content.split('').reverse().join(''))
  } catch (e) {
    return null
  }
}

function set (stamp, value) {
  write(path.join(options.storage_root, stamp + options.storage_ext), value)
}

function get (stamp) {
  return read(path.join(options.storage_root, stamp + options.storage_ext))
}

function watch (stamp, callback) {
  fs.watchFile(path.join(options.storage_root, stamp + options.storage_ext), { interval: 500 }, (curr, prev) => {
    if (curr && curr.size && curr.mtime !== prev.mtime) {
      const data = get(stamp)
      data && callback(data)
    }
  })
}

module.exports = { write: write, read: read, set: set, get: get, watch: watch }
