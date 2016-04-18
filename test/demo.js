const storage = require('../src/js/common/storage.js');
const path = require('path');

const helloname = path.join(__dirname, './temp.bin');
storage.set(helloname, { hello: 'world', sex: 19 });

console.log(storage.get(helloname));



const demoname = path.join(__dirname, './temp1.bin');
storage.set(demoname, 'hellloooo');

console.log(storage.get(demoname));
