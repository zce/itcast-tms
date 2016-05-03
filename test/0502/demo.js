// const fetch = require('../updater/fetch');


// // console.time('start');

// // var count = 0;
// // for (var i = 0; i < 100; i++) {
// //   fetch('http://www.baidu.com')
// //     .then(res => {
// //       console.log(res);
// //       count++ == 99 && console.timeEnd('start');
// //     })
// //     .catch(error => {
// //       console.error(error);
// //     });
// // }


// fetch('http://www.micua.com/sadas')
//   .then(res => {
//     // console.log(res);
//   })
//   .catch(error => {
//     console.error(error);
//   });

// ============================================================================

// const updater = require('../updater/updater.js');

// updater();

// updater
//   .updateUpdater('http://127.0.0.1:8080/updater.zip')
//   .then(file => console.log(file))
//   .catch(error => console.log(error));


const utils = require('../updater/utils');

utils.fetchFile(
  'http://git.oschina.net/micua/files/raw/master/itcast-evaluation/core/v2.6.4/core.zip',
  (p) => {
    console.log(p);
  }).then((res) => {
  console.log(res);
})
