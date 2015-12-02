module.exports = ArrayType;

var CData = require('./CData');
var CType = require('./CType');

var RefArray = require('ref-array');
var inherits = require('util').inherits;

/**
 * ArrayType represents C arrays.
 */

function ArrayType (elementType, length) {
  var refType = new RefArray(elementType.type, length);
  var lengthStr = length != null ? length : '';
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

ArrayType.prototype.toSource = function toSource () {
  return this.elementType.toSource() + '.array(' + this._lengthStr + ')';
};

/**
 *
 */

function ArrayData (type, value) {
  CData.call(this, type, value);
}
inherits(ArrayData, CData);

Object.defineProperty(ArrayData.prototype, 'value', {
  get: function () {
    throw new TypeError('.value only works on character and numeric types, not `ctypes.char.array(3)`');
  }
});

/**
 * Returns a new CData object of the appropriate pointer type, whose value points
 * to the specified array element on which the method was called.
 */

ArrayData.prototype.addressOfElement = function addressOfElement (index) {

};
