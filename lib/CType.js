module.exports = CType;

var _CData = require('./CData');
var ArrayType = require('./ArrayType');
var PointerType = require('./PointerType');

var crypto = require('crypto');
var inherits = require('util').inherits;
var setPrototypeOf = require('setprototypeof');
var setFunctionName = require('function-name');

function randomHexIdentifier (length) {
  var id;
  do {
    id = crypto.randomBytes(length / 2).toString('hex');
  } while (/\d/.test(id[0]));
  return id;
}

function c (p, length) {
  var name, args;

  name = randomHexIdentifier(20);

  if (typeof length === 'number') {
    args = [];
    while (length--) args.push(randomHexIdentifier(6));
    args = args.join(',');
  } else {
    args = '';
  }

  return new Function('p',
    'return function ' + name + '(' + args + '){' +
      'return p.apply(this,arguments);' +
    '};')(p);
}

/**
 * All data types declared using the js-ctypes API are represented by CType
 * objects. These objects have assorted methods and properties that let you create
 * objects of these types, find out information about them, and so forth. The
 * specific properties and methods on each object vary depending on the data type
 * represented.
 */

// XXX: ideally we'd be using `class CType extends Function`
// syntax here, but that doesn't seem to work with V8 quite yet…
function CType (type, name, _ctor, _data, _length) {
  var CData = _data || _CData;

  // See: http://git.io/vRfUW
  // We can't simply create an anonymous function and set the name on it.
  // Instead we must create a unique named proxy function, otherwise V8's
  // internal function lookup table notices that it's the same anonymous function
  // and gives us back the same instance.
  var self = c(function (value) {
    return new CData(self, value);
  }, _length);

  self.type = type;

  // set up proper inheritance
  var ctor = _ctor || CType;
  self.constuctor = ctor;
  self._super = ctor;
  setPrototypeOf(self, ctor.prototype);

  /**
   * The type's name. Read only.
   *
   * For primitive types, this is just the name of the corresponding C type. For
   * structure and opaque pointer types, this is simply the string that was passed
   * to the constructor. For other function, pointer, and array types, this should
   * be a valid C type expression.
   *
   * XXX: we can't simply define this as a getter on the prototype since V8
   * doesn't allow you to set the `name` property on Function instances
   */
  setFunctionName(self, name || type.name);
  //console.log(self.toString())
  //console.log(Function.prototype.toString.call(self))

  return self;
}
inherits(CType, Function);

/**
 * Returns a CType representing the data type "pointer to this type". This is the
 * result of calling ctypes.PointerType(the_type). Read only.
 */

Object.defineProperty(CType.prototype, 'ptr', {
  enumerable: true,
  configurable: true,
  get: function () {
    return PointerType(this);
  }
});

/**
 * The size of the type, in bytes. This is the same value as the C sizeof. Read
 * only.
 *
 * Note: `ctypes.void_t.size` is undefined.
 */

Object.defineProperty(CType.prototype, 'size', {
  enumerable: true,
  configurable: true,
  get: function () {
    return this.type.size;
  }
});

/**
 * Returns a new CType representing an array of elements of the type on which it
 * was called.
 *
 * https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/js-ctypes_reference/CType#array()
 */

CType.prototype.array = function array (n) {
  return ArrayType(this, n);
};

/**
 * Returns a JavaScript expression that evaluates to a CType describing the same
 * C type as this object.
 */

CType.prototype.toSource = function toSource () {
  return 'ctypes.' + this.name;
};

/**
 * Returns a string identifying the type. The format of this string is
 * "type " + name.
 *
 * https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/js-ctypes_reference/CType#toString()
 */

CType.prototype.toString = function toString () {
  return 'type ' + this.name;
};
