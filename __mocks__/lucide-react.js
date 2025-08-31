const React = require('react');

module.exports = new Proxy({}, {
  get: function(target, prop) {
    return () => React.createElement('div');
  }
});