module.exports = CType;

var CData = require('./CData');
var inherits = require('./inherits');
var ArrayType = require('./ArrayType');
var PointerType = require('./PointerType');

var createFunction = require('function-class');
var invoke = require('function-class/invoke');

/**
 * All data types declared using the js-ctypes API are represented by CType
 * objects. These objects have assorted methods and properties that let you create
 * objects of these types, find out information about them, and so forth. The
 * specific properties and methods on each object vary depending on the data type
 * represented.
 */

function CType (type, _name) {
  var name = arguments.length >=2 ? _name : type.name;

  if (typeof this !== 'function')
    return createFunction(name, null, CType, arguments);

  inherits(this, CData);

  // used by the `size` getter
  this._isVoid = type.size === 0 && type.indirection === 1;

  this.type = type;

  if (this._isVoid) {
    this[invoke] = function (value) {
      throw new Error('cannot construct from void_t');
    };
  } else {
    var constructor = this;
    this[invoke] = function (value) {
      if (!(this instanceof constructor))
        return new constructor(value);
      CData.call(this, value);
    };
  }
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
    if (!this._isVoid) {
      return this.type.size;
    }
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
