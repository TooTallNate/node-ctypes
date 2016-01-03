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

exports['test ctypes.open()'] = function(assert) {
};


exports['test ctypes.void_t.size is `undefined`'] = function(assert) {
  assert.ok(!ctypes.void_t.hasOwnProperty('size'), 'void_t.size should not be an "own property"');
  assert.strictEqual(ctypes.void_t.size, void(0), 'void_t.size should be `undefined`');
};


exports['test CData throws TypeError for out of range'] = function(assert) {
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

exports['test CData instanceof'] = function(assert) {
  assert.ok(ctypes.uint8_t(1) instanceof ctypes.uint8_t);
  assert.ok(ctypes.uint8_t(1) instanceof ctypes.CData);
};


exports['test CType instanceof'] = function(assert) {
  assert.ok(ctypes.uint8_t instanceof ctypes.CType);
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

exports['test CType#toString()'] = function(assert) {
  assert.equal(ctypes.uint8_t.toString(), 'type uint8_t');
  assert.equal(ctypes.int8_t.toString(), 'type int8_t');
  assert.equal(ctypes.char.toString(), 'type char');
  assert.equal(ctypes.signed_char.toString(), 'type signed_char');
  assert.equal(ctypes.unsigned_char.toString(), 'type unsigned_char');
  assert.equal(ctypes.void_t.toString(), 'type void');
};


exports['test PointerType instanceof'] = function(assert) {
  assert.ok(ctypes.uint8_t.ptr instanceof ctypes.PointerType);
  assert.ok(ctypes.uint8_t.ptr instanceof ctypes.CType);
  assert.ok(ctypes.voidptr_t instanceof ctypes.PointerType);
  assert.ok(ctypes.voidptr_t instanceof ctypes.CType);
};

exports['test PointerType ==='] = function(assert) {
  assert.ok(ctypes.uint8_t.ptr === ctypes.uint8_t.ptr);
  assert.ok(ctypes.uint8_t.ptr === ctypes.PointerType(ctypes.uint8_t));
};

exports['test PointerType#name'] = function(assert) {
  assert.equal(ctypes.uint8_t.ptr.name, 'uint8_t*');
};

exports['test PointerType#size'] = function(assert) {
  var is64bit;
  if (ctypes.voidptr_t.size == 4 /* 32-bit */) {
    is64bit = false;
  } else if (ctypes.voidptr_t.size == 8 /* 64-bit */) {
    is64bit = true;
  }

  assert.equal(ctypes.uint8_t.ptr.size, is64bit ? 8 : 4);
};

exports['test PointerType#toString()'] = function(assert) {
  assert.equal(ctypes.uint8_t.ptr.toString(), 'type uint8_t*');
  assert.equal(ctypes.voidptr_t.toString(), 'type void*');
};


exports['test PointerData instanceof'] = function(assert) {
  var ptr = ctypes.voidptr_t(0);
  assert.ok(ptr instanceof ctypes.voidptr_t);
  assert.ok(ptr instanceof ctypes.CData);

  ptr = ctypes.int(1).address();
  assert.ok(ptr instanceof ctypes.int.ptr);
  assert.ok(ptr instanceof ctypes.CData);
};

exports['test PointerData#contents'] = function(assert) {
  var i = ctypes.int(-4);
  var ptr = i.address();
  assert.equal(-4, ptr.contents);

  ptr.contents = 5;

  assert.equal(5, ptr.contents);
  assert.equal(5, i.value);
};

exports['test PointerData#isNull()'] = function(assert) {
  assert.equal(false, ctypes.voidptr_t(1).isNull());
  assert.equal(true, ctypes.voidptr_t(0).isNull());
};


exports['test ArrayType#name'] = function(assert) {
  assert.equal(ctypes.uint8_t.array().name, 'uint8_t[]');
  assert.equal(ctypes.float.array(1).name, 'float[1]');
  assert.equal(ctypes.int.array(10).name, 'int[10]');
};

exports['test ArrayType#size'] = function(assert) {
  assert.equal(ctypes.int16_t.array(1).size, 2);
  assert.equal(ctypes.int16_t.array(2).size, 4);
  assert.equal(ctypes.int16_t.array(10).size, 20);

  // `undefined` for indeterminate sized array types
  assert.strictEqual(ctypes.uint8_t.array().size, void(0));
};

exports['test ArrayType#toString()'] = function(assert) {
  assert.equal(ctypes.uint8_t.array().toString(), 'type uint8_t[]');
  assert.equal(ctypes.float.array(1).toString(), 'type float[1]');
  assert.equal(ctypes.int.array(10).toString(), 'type int[10]');
};


exports['test ArrayData instanceof'] = function(assert) {
  var IntArray = ctypes.int.array();
  var IntArrayFour = ctypes.int.array(4);
  var array = IntArrayFour([1, -2, 3, -4]);
  assert.ok(!(array instanceof IntArray));
  assert.ok(array instanceof IntArrayFour);
  assert.ok(array instanceof ctypes.CData);
};

exports['test ArrayData throws TypeError invalid input'] = function(assert) {
  assert.throws(function () {
    ctypes.int.array()();
  }, TypeError);
  assert.throws(function () {
    ctypes.int.array()();
  }, /size undefined ArrayType constructor takes one argument/);

  assert.throws(function () {
    ctypes.int.array()(undefined);
  }, TypeError);
  assert.throws(function () {
    ctypes.int.array()(undefined);
  }, /argument of size undefined ArrayType constructor must be an array object or integer/);

  assert.throws(function () {
    ctypes.int.array(1)(1, 2, 3);
  }, TypeError);
  assert.throws(function () {
    ctypes.int.array(1)(1, 2, 3);
  }, /size defined ArrayType constructor takes at most one argument/);
};


if (!isNode) require('sdk/test').run(exports);
