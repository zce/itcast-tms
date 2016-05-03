const p1 = new Promise((resolve,reject)=>{
  setTimeout(function() {
    resolve(1);
  }, 1000);
});

const p2 = new Promise((resolve,reject)=>{
  setTimeout(function() {
    resolve(2);
  }, 50);
});

const p3 = new Promise((resolve,reject)=>{
  setTimeout(function() {
    resolve(3);
  }, 0);
});

const p = Promise.all([p1,p2,p3]);

p.then(nums=>{
  console.log(nums);
});
