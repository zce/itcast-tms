const utils = require('../../updater/utils');

const feed_url = 'http://git.oschina.net/micua/files/raw/master/tms/latest/index.json';

const packages = {
  core: require(`../../${process.env.NODE_ENV === 'production' ? 'core' : 'src'}/package.json`),
  data: require('../../data/package.json'),
  updater: require('../../updater/package.json'),
};

utils.fetchUrl(`${feed_url}?version=${new Date().getTime()}`)
  .then(feed => {
    const feedUrls = JSON.parse(feed);
    // console.log(feedUrls);
    return Promise.all(Object.keys(feedUrls).map(key => utils.fetchUrl(`${feedUrls[key]}?version=${packages[key].version}`)));
  })
  .then(feeds => {
    console.log(feeds);
  })
  .catch(error => {
    console.log(error);
  });
