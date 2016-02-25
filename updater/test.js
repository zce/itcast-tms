const index = require('./index');
index.update((p) => { console.log(p); }, () => {
  console.log('ok');
});