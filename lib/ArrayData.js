module.exports = ArrayData;

var CData = require('./CData');
var inherits = require('./inherits');

var ref = require('ref');
var ArrayIndex = require('array-index');

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

ArrayData.prototype[ArrayIndex.get] = function __get__ (index) {
  return this._array[index];
};

ArrayData.prototype[ArrayIndex.set] = function __set__ (index, value) {
  return this._array[index] = value;
};

/**
 * Returns a new CData object of the appropriate pointer type, whose value points
 * to the specified array element on which the method was called.
 */

ArrayData.prototype.addressOfElement = function addressOfElement (index) {
  if (arguments.length !== 1)
    throw new TypeError('ArrayType.prototype.addressOfElement takes one argument');

  if ('number' !== typeof index || index < 0 || index >= this.length)
    throw new TypeError('invalid index');

  var type = this.constructor.elementType;
  var start = type.size * index;
  var end = start + type.size;
  var buffer = this._array.buffer.slice(start, end);
  return type.ptr(buffer);
};

ArrayData.prototype.toSource = function toSource () {
  return this.constructor.toSource() + '(['
    + this._array.toArray().join(', ') + '])';
};
