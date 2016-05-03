const updater = require('../../updater/updater');
const res = updater.check()
  .then(needs => {
    return Promise.all(Object.key(needs).map(need => updater.update(needs.url, '', p => console.log(p))));
  })
  .then(files=>{
    console.log(files.length);
  })
  .catch(error => console.log(error));
