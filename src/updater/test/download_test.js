const fs = require('fs')
const download = require('download')

download('http://git.oschina.net/micua/files/raw/master/tms/dist/core-4.0.0-alpha1.zip', '../temp', { extract: true })
  .then(data => { console.log(data) })
  .catch(error => { console.log(error) })
