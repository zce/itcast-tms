// var admin = require('./core/controllers/admin.js');

// // console.log(admin.stop);

// admin.stop({
//   params: { stamp: '935cx3' },
//   cache: { setItem: () => {} }
// });
const stamp = '935cx3';
const path = require('path');
const report = require('./core/functions/report');
const md = require('./core/middlewares/cache')
const cache = md(path.join(__dirname, './.eva-temp'));

console.log(cache);

const temp = cache.getItem(`${stamp}_test_info`);
temp.rate_count = cache.getItem(`${stamp}_rating_count`);

report.compute(cache, temp);
