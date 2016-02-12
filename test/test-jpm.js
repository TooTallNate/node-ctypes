var env;
var ctypes;

// running in Node.js or jpm?
const isNode = typeof process === 'object';

if (isNode) {
  // nodejs
  ctypes = require('../');
  env = process.env;
} else {
  // jpm
  const chrome = require('chrome');
  chrome.Cu.import('resource://gre/modules/ctypes.jsm');
  env = require('sdk/system').env;
}

exports['test ctypes.libraryName()'] = function(assert) {
  assert.ok(/libc\.(so|dylib|dll)/.test(ctypes.libraryName('c')));
  assert.ok(/libtest\.(so|dylib|dll)/.test(ctypes.libraryName('test')));
  assert.ok(/libss3\.(so|dylib|dll)/.test(ctypes.libraryName('ss3')));
};

exports['test ctypes.open()'] = function(assert) {
  var libtestPath = env.PWD + '/test/build/Release/' + ctypes.libraryName('test');

  var lib = ctypes.open(libtestPath);

  var add_with_c = lib.declare('add', ctypes.default_abi,
      ctypes.int,    // return type
      ctypes.int,    // a
      ctypes.int     // b
  );

  assert.equal(add_with_c(2, 5), 7);

  lib.close();
};


exports['test ctypes.void_t.size is `undefined`'] = function(assert) {
  assert.ok(!ctypes.void_t.hasOwnProperty('size'), 'void_t.size should not be an "own property"');
  assert.equal('undefined', typeof ctypes.void_t.size, 'void_t.size should be `undefined`');
};

exports['test ctypes.void_t() throws an Error'] = function(assert) {
  assert.throws(function () {
    ctypes.void_t();
  }, /cannot construct from void_t/);
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

exports['test CData#toString()'] = function(assert) {
  var t = ctypes.int32_t(5);
  assert.equal('ctypes.int32_t(5)', t.toString());
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


exports['test ArrayType instanceof'] = function(assert) {
  var IntArray = ctypes.int.array();
  assert.ok(IntArray instanceof ctypes.ArrayType);
  assert.ok(IntArray instanceof ctypes.CType);
};

exports['test ArrayType#name'] = function(assert) {
  assert.equal(ctypes.uint8_t.array().name, 'uint8_t[]');
  assert.equal(ctypes.float.array(1).name, 'float[1]');
  assert.equal(ctypes.int.array(10).name, 'int[10]');
};

exports['test ArrayType#length'] = function(assert) {
  assert.equal(ctypes.float.array(1).length, 1);
  assert.equal(ctypes.int.array(2).length, 2);
  assert.equal(ctypes.int.array(1024).length, 1024);
};

exports['test ArrayType#size'] = function(assert) {
  assert.equal(ctypes.int16_t.array(1).size, 2);
  assert.equal(ctypes.int16_t.array(2).size, 4);
  assert.equal(ctypes.int16_t.array(10).size, 20);

  // `undefined` for indeterminate sized array types
  assert.equal('undefined', typeof ctypes.uint8_t.array().size);
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

exports['test ArrayData#[index]'] = function(assert) {
  var array = ctypes.int.array()([1, -2, 3, -4]);

  // getters
  assert.equal(1, array[0]);
  assert.equal(-2, array[1]);
  assert.equal(3, array[2]);
  assert.equal(-4, array[3]);

  // setters
  array[3] = 16;
  assert.equal(16, array[3]);
};

exports['test ArrayData#length'] = function(assert) {
  var array = ctypes.int.array()([1, -2, 3, -4]);
  assert.equal(4, array.length);

  var array = ctypes.int.array()([1, -2]);
  assert.equal(2, array.length);
};

exports['test ArrayData#addressOfElement()'] = function(assert) {
  var array = ctypes.int.array()([1, -2, 3, -4]);

  var ptr = array.addressOfElement(3);
  assert.equal(ptr.constructor.targetType, ctypes.int);
  assert.equal(ptr.contents, -4);
};

exports['test ArrayData throws TypeError on invalid input'] = function(assert) {
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


exports['test StructType instanceof'] = function(assert) {
  var S = ctypes.StructType('S');
  assert.ok(S instanceof ctypes.StructType);
  assert.ok(S instanceof ctypes.CType);
};

exports['test StructType#name'] = function(assert) {
  var foo = ctypes.StructType('foo');
  assert.equal(foo.name, 'foo');
};

exports['test StructType#size'] = function(assert) {
  var one = ctypes.StructType('one', [
    { 'one': ctypes.uint8_t },
  ]);
  assert.equal(one.size, 1);

  var two = ctypes.StructType('two', [
    { 'one': ctypes.uint16_t },
    { 'two': ctypes.uint8_t },
  ]);
  assert.equal(two.size, 4);
};

exports['test StructType#fields'] = function(assert) {
  var fields = [
    { 'one': ctypes.uint16_t },
    { 'two': ctypes.uint8_t },
  ];
  var two = ctypes.StructType('two', fields);
  assert.deepEqual(two.fields, fields);
};

exports['test StructType#fields (opaque is `undefined`)'] = function(assert) {
  var opaque = ctypes.StructType('opaque');
  assert.equal('undefined', typeof opaque.fields);
};

exports['test StructType#size (opaque is `undefined`)'] = function(assert) {
  var opaque = ctypes.StructType('opaque');
  assert.equal('undefined', typeof opaque.size);
};

exports['test StructType#prototype (opaque is `undefined`)'] = function(assert) {
  var opaque = ctypes.StructType('opaque');
  assert.equal('undefined', typeof opaque.prototype);

  // `prototype` should be set after the `define()` call
  opaque.define([ { foo: ctypes.int } ]);
  assert.equal('object', typeof opaque.prototype);
};

exports['test StructType#toString()'] = function(assert) {
  var timeval = ctypes.StructType('timeval');
  assert.equal(timeval.toString(), 'type timeval');
};


exports['test StructData instanceof'] = function(assert) {
  var foo = ctypes.StructType('foo', [ { foo: ctypes.uint8_t } ]);
  var f = new foo();
  assert.ok(f instanceof foo);
  assert.ok(f instanceof ctypes.CData);
};

exports['test StructData#["foo"]'] = function(assert) {
  var Foo = ctypes.StructType('Foo', [
    { int32: ctypes.int32_t },
    { int16: ctypes.int16_t },
  ]);

  // getters
  var f = new Foo(1, 2);
  assert.equal(f.int32, 1);
  assert.equal(f.int16, 2);

  // setters
  f.int32 = 3;
  f.int16 = 4;

  assert.equal(f.int32, 3);
  assert.equal(f.int16, 4);
};

exports['test StructData#addressOfField()'] = function(assert) {
  var Foo = ctypes.StructType('Foo', [
    { int32: ctypes.int32_t },
    { int16: ctypes.int16_t },
  ]);

  var f = new Foo(1, 2);

  var ptr = f.addressOfField('int32');
  assert.equal(ptr.constructor.targetType, ctypes.int32_t);
  assert.equal(ptr.contents, 1);

  ptr = f.addressOfField('int16');
  assert.equal(ptr.constructor.targetType, ctypes.int16_t);
  assert.equal(ptr.contents, 2);
};

exports['test StructData throws Error for opaque type'] = function(assert) {
  var opaque = ctypes.StructType('opaque');
  assert.throws(function () {
    opaque();
  }, /cannot construct an opaque StructType/);
};


exports['test Int64 throws TypeError on no input'] = function(assert) {
  assert.throws(function () {
    ctypes.Int64();
  }, /Int64 constructor takes one argument/);

  assert.throws(function () {
    ctypes.UInt64();
  }, /UInt64 constructor takes one argument/);
};

exports['test Int64#toString(radix)'] = function(assert) {
  var input = -201;
  var num = ctypes.Int64(input);
  assert.equal(input.toString(8), num.toString(8));
  assert.equal(input.toString(10), num.toString(10));
  assert.equal(input.toString(16), num.toString(16));
};

exports['test Int64 works with string inputs'] = function(assert) {
  var num = ctypes.Int64('-0x1234567890ABCDEF');
  assert.equal('-1311768467294899695', num.toString());

  var num = ctypes.Int64('10');
  assert.equal('10', num.toString());
};

exports['test Int64.compare()'] = function(assert) {
  var one = ctypes.Int64(1);
  var two = ctypes.Int64(2);
  assert.equal(0, ctypes.Int64.compare(one, one));
  assert.equal(-1, ctypes.Int64.compare(one, two));
  assert.equal(1, ctypes.Int64.compare(two, one));
};

exports['test Int64.compare() throws if not given 2 arguments'] = function(assert) {
  assert.throws(function () {
    ctypes.Int64.compare(-1);
  }, /Int64\.compare takes two arguments/);
};

exports['test Int64.hi()'] = function(assert) {
  var num = ctypes.Int64('-0x1234567890ABCDEF');
  assert.equal(-0x12345679, ctypes.Int64.hi(num));
};

exports['test Int64.lo()'] = function(assert) {
  var num = ctypes.Int64('-0x1234567890ABCDEF');
  assert.equal(0x6F543211, ctypes.Int64.lo(num));
};

exports['test UInt64 throws TypeError on negative numbers'] = function(assert) {
  assert.throws(function () {
    ctypes.UInt64(-1);
  }, /can't pass the number -1 to argument 1 of UInt64/);
};

exports['test UInt64 works with string inputs'] = function(assert) {
  var num = ctypes.UInt64('0x1234567890ABCDEF');
  assert.equal('1311768467294899695', num.toString());

  var num = ctypes.UInt64('10');
  assert.equal('10', num.toString());
};

exports['test UInt64.hi()'] = function(assert) {
  var num = ctypes.UInt64('0xffffffffffffffff');
  assert.equal(0xffffffff, ctypes.UInt64.hi(num));
};

exports['test UInt64.lo()'] = function(assert) {
  var num = ctypes.UInt64('0xffffffffffffffff');
  assert.equal(0xffffffff, ctypes.UInt64.lo(num));
};


if (!isNode) require('sdk/test').run(exports);
