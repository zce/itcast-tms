exports.send = function(data) {
  this.$timeout(() => {
    data.status = $.options.status_keys.initial;
    // data.status = $.options.status_keys.send;
    // Storage.set(data.stamp)
  }, 1000);
};
