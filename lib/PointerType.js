module.exports = PointerType;

var CData = require('./CData');
var CType = require('./CType');

var ref = require('ref');
var inherits = require('util').inherits;
var createFunction = require('function-class');
var invoke = require('function-class/invoke');

function PointerType (targetType) {
  var name = targetType.name + '*';

  if (typeof this !== 'function')
    return createFunction(name, null, PointerType, arguments);

  var type = ref.refType(targetType.type);
  CType.call(this, type);

  // TODO: make read-only
  this.targetType = targetType;
}
inherits(PointerType, CType);

PointerType.prototype.size = ref.sizeof.pointer;

PointerType.prototype.toSource = function toSource () {
  return this.targetType.toSource() + '.ptr';
};


/**
 *
 */

function PointerData (type, value) {
  CData.call(this, type, value);
  this._targetBuffer = ref.deref(this._buffer);
}
inherits(PointerData, CData);

Object.defineProperty(PointerData.prototype, 'value', {
  get: function () {
    throw new TypeError('.value only works on character and numeric types, not `'
      + this.constructor.toSource() + '`');
  }
});

/**
 * Reading this property returns a CData object referring to the pointed-to
 * contents of the object. Writing to this value writes the C conversion of the
 * data into the pointed-to memory. If converting the data fails, a TypeError
 * exception is thrown.
 */

Object.defineProperty(PointerData.prototype, 'contents', {
  enumerable: true,
  configurable: true,
  get: function () {
    return 
  },
  set: function (v) {

  }
});

/**
 * Determines whether or not the pointer's value is `null`.
 */

PointerData.prototype.isNull = function isNull () {
  return ref.isNull(this._buffer);
};

PointerData.prototype.toSource = function toSource () {
  return this.constructor.toSource() + '(ctypes.UInt64("0x'
    + this._targetBuffer.hexAddress() + '"))';
};
