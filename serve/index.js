const express = require('express');

const app = express();

app.use('/update', nuts.router);

app.listen(4000, err => err || console.log('update server is ready! @ http://localhost:4000/'));



// const nuts = Nuts({
//   // GitHub configuration
//   token: '45e281065e63e00e7c572612b01b08328df7459f',
//   repository: 'Micua/itcast-tms',
//   // // (string) Path to the cache folder, default value is a temprary folder
//   // cache: 'cache',
//   // // (int) Max size of the cache (default is 500MB)
//   // cacheMax: 500,
//   // // (int) Maximum age in ms (default is 1 hour)
//   // cacheMaxAge: 1,
//   // // (boolean) Pre-fetch list of releases at startup (default is true)
//   // preFetch: true,
//   // // GitHub specific configuration:
//   // // (string) Secret for the GitHub webhook'
//   // // refreshSecret: '',
// });

// nuts.before('download', (download, next) => {
//   console.log('user is downloading', download.platform.filename, "for version", download.version.tag, "on channel", download.version.channel, "for", download.platform.type);
//   next();
// });

// nuts.after('download', (download, next) => {
//   console.log('user downloaded', download.platform.filename, "for version", download.version.tag, "on channel", download.version.channel, "for", download.platform.type);
//   next();
// });
