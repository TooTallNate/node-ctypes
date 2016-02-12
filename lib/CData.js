module.exports = CData;

var ref = require('ref');

var PointerType = require('./PointerType');
var toSource = require('./toSource');

function cantConvert (type, value) {
  return 'can\'t convert the ' + (typeof value) + ' ' + toSource(value)
    + ' to the type ' + type.name;
}

/**
 * A CData object represents a C value or function located in memory.
 *
 * This base type assumes a numerical type.
 */

function CData (value) {
  var type = this.constructor;
  if ('number' !== typeof value) {
    throw new TypeError(cantConvert(type, value));
  }
  try {
    this._buffer = ref.alloc(type.type, value);
  } catch (e) {
    if (e.message == 'value is out of bounds') {
      e.message = cantConvert(type, value);
    }
    throw e;
  }
}

/**
 * The JavaScript equivalent of the CData object's value. This will throw
 * a TypeError exception if the value can't be converted.
 */

Object.defineProperty(CData.prototype, 'value', {
  enumerable: true,
  configurable: true,
  get: function () {
    return ref.deref(this._buffer);
  }
});

/**
 * Returns a CData object of the pointer type
 * ctypes.PointerType(dataObject.constructor) whose value points to the C object
 * referred to by the object. This provides a way to get a pointer to the actual
 * data of the C value represented by the CData object.
 */

CData.prototype.address = function address () {
  return PointerType(this.constructor)(this._buffer);
};

/**
 * Returns the string "t(arg)", where t and arg are implementation-defined
 * JavaScript expressions intended to represent the type of the CData object and
 * its value, respectively.
 */

CData.prototype.toSource = function toSource () {
  return this.constructor.toSource() + '(' + this.value + ')';
};

CData.prototype.readString = function readString () {
  throw new Error('not a PointerType or ArrayType');
};

/**
 * Returns a string identifying the data.
 */

CData.prototype.toString = function toString () {
  return this.toSource();
};
