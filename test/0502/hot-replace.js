console.log('hello world');


const fs = require('fs');

fs.writeFile('./hot-replace.js', `
  console.log('hello world');
  console.log(11111);
`, 'utf8', (err) => {
  if (err) {
    console.log(err);
    return false;
  }
  // setTimeout(function() {
  delete require.cache[__filename];
  require('./hot-replace.js');

  // }, 0);
});
