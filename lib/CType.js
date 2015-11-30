
module.exports = CType;

var PointerType = require('./PointerType');

/**
 * All data types declared using the js-ctypes API are represented by CType
 * objects. These objects have assorted methods and properties that let you create
 * objects of these types, find out information about them, and so forth. The
 * specific properties and methods on each object vary depending on the data type
 * represented.
 */

function CType (type, name) {
  this.type = type;
  this._name = name;
}

/**
 * The type's name. Read only.
 *
 * For primitive types, this is just the name of the corresponding C type. For
 * structure and opaque pointer types, this is simply the string that was passed
 * to the constructor. For other function, pointer, and array types, this should
 * be a valid C type expression.
 */

Object.defineProperty(CType.prototype, 'name', {
  enumerable: true,
  configurable: true,
  get: function () {
    return this._name || this.type.name;
  }
});

/**
 * Returns a CType representing the data type "pointer to this type". This is the
 * result of calling ctypes.PointerType(the_type). Read only.
 */

Object.defineProperty(CType.prototype, 'ptr', {
  enumerable: true,
  configurable: true,
  get: function () {
    return new PointerType(this);
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
 * https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/js-ctypes_reference/CType#array()
 */

CType.prototype.array = function array (n) {
  return ArrayType(this, n);
}

/**
 * Returns a string identifying the type. The format of this string is
 * "type " + name.
 *
 * https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/js-ctypes_reference/CType#toString()
 */

CType.prototype.toString = function toString () {
  return 'type ' + this.name;
};
