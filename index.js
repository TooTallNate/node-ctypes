// cause `jpm test`
if (typeof process == 'object') {
  // nodejs
  // invoke `node t` in the root of this module to run `t.js` test script
  module.exports = require('./lib/index');
} else {
  // jpm
  // invoke `jpm run` in the root of this module to run `t.js` test script
  require('./t');
}
