var os = require('os')

module.exports = {
  getLocalAreaIp: () => {
    var networkInterfaces = os.networkInterfaces()
    for (var name in networkInterfaces) {
      var infos = networkInterfaces[name]
      if (infos && infos.length) {
        for (var i = 0; i < infos.length; i++) {
          if (infos[i].family === 'IPv4' && infos[i].address !== '127.0.0.1') {
            return infos[i].address
          }
        }
      }
    }
  }
}
