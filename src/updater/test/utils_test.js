const utils = require('../lib/utils')

utils.fetchFile('http://git.oschina.net/micua/files/raw/master/tms/dist/core-4.0.0-alpha1.zip', 'core.asar', p => {
  console.log(p)
})
