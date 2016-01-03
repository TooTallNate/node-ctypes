module.exports = PointerData;

var CData = require('./CData');

var ref = require('ref');
var inherits = require('util').inherits;

/**
 *
 */

function PointerData (value) {
  var buf = ref.alloc('uint64', value);
  CData.call(this, ref.readPointer(buf, 0));

  //this._buffer = buf;
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
  return ref.isNull(this._targetBuffer);
};

PointerData.prototype.toSource = function toSource () {
  return this.constructor.toSource() + '(ctypes.UInt64("0x'
    + this._targetBuffer.hexAddress() + '"))';
};
