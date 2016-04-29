const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

const _ = require('lodash');

const storage = require('./storage');

const options = global.OPTIONS;

const stamps = [];

function requestListener(req, res) {
  const urlObj = url.parse(req.url, true);
  const paths = urlObj.pathname.split('/').filter(i => i);
  const stamp = paths[0];
  if (paths.length !== 1 || !stamps.includes(stamp)) {
    res.writeHead(404, 'Not Found');
    res.end(`<h1>${req.url} is Not Found! </h1>`);
    return false;
  }

  const data = storage.get(stamp);
  if (!data) {
    res.writeHead(404, 'Not Found');
    res.end(`<h1>${req.url} is Not Found! </h1>`);
    return false;
  }

  fs.readFile(path.join(__dirname, 'rating.html'), 'utf8', (err, tmpl) => {
    if (err) {
      options.logger.main.error(err);
      return false;
    }
    var compiled = _.template(tmpl);
    res.end(compiled(data));
  });
}

// const server_url = `http://${options.server_ip}:${options.server_port}/`;
const server = module.exports = http.createServer(requestListener).listen(
  options.server_port,
  options.server_ip,
  err => {
    if (err) {
      options.logger.main.error(err);
      return false;
    }
    options.logger.main.info(`server run @ http://${server.address().address}:${server.address().port}/`);
  }
);

// options.server_url = server_url;

// module.exports = server_url;
