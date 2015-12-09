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


exports['test CData#throws TypeError for out of range'] = function(assert) {
  var err;
  try {
    ctypes.uint8_t(-1);
  } catch (e) {
    err = e;
  }

  assert.ok(!!err);
  assert.equal(err.message, 'can\'t convert the number -1 to the type uint8_t');

  err = null;
  try {
    ctypes.uint8_t('a');
  } catch (e) {
    err = e;
  }

  assert.ok(!!err);
  assert.equal(err.message, 'can\'t convert the string "a" to the type uint8_t');
};

exports['test CData#value'] = function(assert) {
  assert.equal(ctypes.uint8_t(1).value, 1);
  assert.equal(ctypes.uint8_t(255).value, 255);
};


exports['test CType#name'] = function(assert) {
  assert.equal(ctypes.uint8_t.name, 'uint8_t');
  assert.equal(ctypes.char.name, 'char');
};

exports['test CType#size'] = function(assert) {
  assert.equal(ctypes.uint8_t.size, 1);
  assert.equal(ctypes.uint16_t.size, 2);
  assert.equal(ctypes.uint32_t.size, 4);
  assert.equal(ctypes.uint64_t.size, 8);
};


if (!isNode) require('sdk/test').run(exports);
