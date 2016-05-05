process.env.NODE_ENV = process.env.NODE_ENV || 'production'

if (process.env.NODE_ENV === 'production')
  require('./updater.asar')
else
  require('./updater')
