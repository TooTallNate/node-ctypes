module.exports = ArrayType;

var CData = require('./CData');
var CType = require('./CType');

var ref = require('ref');
var RefArray = require('ref-array');
var ArrayIndex = require('array-index');
var inherits = require('util').inherits;

/**
 * ArrayType represents C arrays.
 */

function ArrayType (elementType, length) {
  var refType = new RefArray(elementType.type, length);
  var lengthStr = length != null ? String(length) : '';
  var name = elementType.name + '[' + lengthStr + ']';
  var self = new CType(refType, name, ArrayType, ArrayData, length);

  // The data type of the elements in an array type. Read only.
  self.elementType = elementType;

  // The number of elements in the array, or undefined if the array type doesn't
  // have a specified length. Read only.
  // XXX: `self.length` gets set to a Number value (0 by default) due to the fact
  // that `self` is a Function instance and length is the arity. The CType
  // constructor handles setting that to a proper value when required.
  self._length = length;
  self._lengthStr = lengthStr;

  return self;
}
inherits(ArrayType, CType);

Object.defineProperty(ArrayType.prototype, 'size', {
  get: function () {
    if (this._length != null) {
      return this.type.size;
    }
  }
});

ArrayType.prototype.toSource = function toSource () {
  return this.elementType.toSource() + '.array(' + this._lengthStr + ')';
};

/**
 *
 */

function ArrayData (type, value) {
  CData.call(this, type, value);

  if (typeof type._length === 'number' && value && value.length !== type._length) {
    throw new TypeError('length of the array [' + value.join(', ')
      + '] does not match to the length of the type ' + type.toSource()
      + ' (expected ' + type._length + ', got ' + value.length + ')');
  }

  // if the base "type" has an indeterminate length, then now we explicitly create
  // a new constructor type with the proper explicit length based on the input
  if (type._length == null && value && typeof value.length === 'number') {
    this.constructor = ArrayType(type.elementType, value.length);
  }

  ArrayIndex.call(this, value.length);

  this._array = ref.deref(this._buffer);
  this._array.length = value.length;
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
