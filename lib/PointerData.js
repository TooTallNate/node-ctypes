module.exports = PointerData;

var CData = require('./CData');
var inherits = require('./inherits');

var ref = require('ref');

/**
 *
 */

function PointerData (value) {
  if (Buffer.isBuffer(value)) {
    this._buffer = value;
  } else {
    var buf = ref.alloc('uint64', value);
    this._buffer = ref.readPointer(buf, 0, this.constructor.size);
  }
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
    if (this.isNull())
      throw new Error('cannot read contents of null pointer');
    return ref.get(this._buffer, 0, this.constructor.targetType.type);
  },
  set: function (value) {
    if (this.isNull())
      throw new Error('cannot write contents to null pointer');
    return ref.set(this._buffer, 0, value, this.constructor.targetType.type);
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
    + this._buffer.hexAddress() + '"))';
};
