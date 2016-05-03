'use strict';

const http = require('http');

http.createServer((request, response) => {
  response.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
  let i = 0;
  // const interval = setInterval(function() {
  //   console.log(i++);
  //   if (i > 6) {
  //     response.end();
  //     clearInterval(interval);
  //   } else {
  //     response.write(new Date().toString());
  //   }
  // }, 1000);

  for (let i = 0; i < 1000000; i++) {
    response.write(new Date().toString());
  }
  response.end();
}).listen(2000, (err) => {
  console.log('ok');
});
