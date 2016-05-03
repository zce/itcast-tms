const online = require('../updater/online');

console.time('online');
console.time('offline');
online()
  .then(() => {
    console.timeEnd('online');
  })
  .catch(() => {
    console.timeEnd('offline');
  })
