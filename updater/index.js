Date.prototype.format = function(format) {
  const o = { 'M+': this.getMonth() + 1, 'd+': this.getDate(), 'H+': this.getHours(), 'm+': this.getMinutes(), 's+': this.getSeconds(), 'q+': Math.floor((this.getMonth() + 3) / 3), 'f+': this.getMilliseconds() };
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp('(' + k + ')').test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  return format;
};

const updater = require('./updater');

updater()
  .then((version) => {
    const core = process.env.NODE_ENV === 'production' ? '../core' : '../src';
    require(core);
  })
  .catch(error => {
    throw error;
  });
