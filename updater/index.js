const autoUpdater = require('./auto-updater');

const core = process.env.NODE_ENV === 'production' ? '../core' : '../src';

require(core);
