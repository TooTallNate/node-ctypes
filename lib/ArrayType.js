module.exports = ArrayType;

var CData = require('./CData');
var CType = require('./CType');
var ArrayData = require('./ArrayData');

var ref = require('ref');
var RefArray = require('ref-array');
var ArrayIndex = require('array-index');
var inherits = require('util').inherits;
var createFunction = require('function-class');
var invoke = require('function-class/invoke');

/**
 * ArrayType represents C arrays.
 */

function ArrayType (elementType, _length) {
  var length, lengthStr, name;
  if (arguments.length >= 2) {
    length = parseInt(_length, 10);
    lengthStr = String(length);
  } else {
    lengthStr = '';
  }
  name = elementType.name + '[' + lengthStr + ']';

  if (typeof 'this' !== 'function')
    return createFunction(name, length, ArrayType, arguments);

  var refType = new RefArray(elementType.type, length);
  CType.call(this, refType);

  // The data type of the elements in an array type. Read only.
  this.elementType = elementType;

  // The number of elements in the array, or undefined if the array type doesn't
  // have a specified length. Read only.
  // XXX: `this.length` gets set to a Number value (0 by default) due to the fact
  // that `this` is a Function instance and length is the arity.
  this._length = length;
  this._lengthStr = lengthStr;
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
