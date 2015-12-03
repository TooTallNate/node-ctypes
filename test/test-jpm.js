const isNode = typeof process === 'object';
if (isNode) {
  // nodejs
  const ctypes = require('../');
} else {
  // jpm
  const self = require('sdk/self');
  const chrome = require('chrome');
  chrome.Cu.import('resource://gre/modules/ctypes.jsm');
}


exports['test main'] = function(assert) {
  assert.equal(ctypes.char.toString(), 'type char');
};


if (!isNode) require('sdk/test').run(exports);
