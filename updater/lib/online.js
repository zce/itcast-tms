const utils = require('./utils')

// module.exports = () => new Promise((resolve, reject) => {
//   dns.lookup('www.baidu.com', (error, addresses, family) => {
//     if (error) {
//       reject(error)
//       return
//     }
//     resolve(true)
//   })
// })

module.exports = () => utils.fetchUrl('http://m.baidu.com')
