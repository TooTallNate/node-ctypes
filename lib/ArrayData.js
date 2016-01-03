module.exports = ArrayData;

var CData = require('./CData');

var ref = require('ref');
var ArrayIndex = require('array-index');
var inherits = require('util').inherits;

/**
 *
 */

function ArrayData (value) {
  var type = this.constructor;

  if (Array.isArray(value) && value.length !== type.length) {
    throw new TypeError('length of the array [' + value.join(', ')
      + '] does not match to the length of the type ' + type.toSource()
      + ' (expected ' + type.length + ', got ' + value.length + ')');
  }

  // "mixin" ArrayIndex
  ArrayIndex.call(this, type.length);

  if (Array.isArray(value)) {
    this._array = new type.type(value);
  } else {
    this._array = new type.type();
    this._array.buffer.fill(0);
  }
}
inherits(ArrayData, CData);

/**
 *
 */

Object.defineProperty(ArrayData.prototype, 'value', {
  get: function () {
    throw new TypeError('.value only works on character and numeric types, not `'
      + this.constructor.toSource() + '`');
  }
});

ArrayData.prototype.__get__ = function __get__ (index) {
  return this._array[index];
};

ArrayData.prototype.__set__ = function __set__ (index, value) {
  return this._array[index] = value;
};

/**
 * Returns a new CData object of the appropriate pointer type, whose value points
 * to the specified array element on which the method was called.
 */

ArrayData.prototype.addressOfElement = function addressOfElement (index) {
  //return this.constructor.elementType.ptr(UInt64());
};

ArrayData.prototype.toSource = function toSource () {
  return this.constructor.toSource() + '(['
    + this._array.toArray().join(', ') + '])';
};
