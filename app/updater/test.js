
const index = require('./index');

index.update((p) => {
  console.log((p * 100).toFixed(2) + '%');
}, (error, data) => {
  console.log(error);
  console.log(data);
})
