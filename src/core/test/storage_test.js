const config = require('../config')
const storage = require('../common/storage')
const path = require('path')

const demo = storage.read(path.resolve(__dirname, '3XYMHU3R.tms'))
console.log(demo)
// demo.emails = [{ name: '评分', title: '系统', email: 'pingfen@itcast.cn' }]
demo.status = config.status_keys.rated
storage.write(path.resolve(__dirname, '3XYMHU3R.tms'), demo)
