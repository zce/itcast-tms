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

const updater = require('../updater/updater.js');

// updater();

updater.updateUpdater('https://github.com/Micua/itcast-tms/releases/download/dist/updater-1.0.0-alpha1.zip');
