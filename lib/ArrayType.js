module.exports = ArrayType;

var CType = require('./CType');
var inherits = require('./inherits');
var ArrayData = require('./ArrayData');

var RefArray = require('ref-array');
var createFunction = require('function-class');
var invoke = require('function-class/invoke');

/**
 * ArrayType represents C arrays.
 */

function ArrayType (elementType, _length) {
  var length, lengthStr, name;
  if (arguments.length >= 2 && 'number' === typeof _length) {
    length = parseInt(_length, 10);
    lengthStr = String(length);
  } else {
    lengthStr = '';
  }
  name = elementType.name + '[' + lengthStr + ']';

  if (typeof this !== 'function')
    return createFunction(name, length, ArrayType, arguments);

  var refType = new RefArray(elementType.type, length);
  CType.call(this, refType);

  inherits(this, ArrayData);

  var constructor = this;
  this[invoke] = function (value) {
    // if the "array type" has an indeterminate length, then we explicitly create
    // a new constructor type with the proper explicit length based on the input
    if (length == null) {
      if (arguments.length !== 1) {
        throw new TypeError('size undefined ArrayType constructor takes one argument');
      }
      if ('number' === typeof value) {
        return ArrayType(constructor.elementType, value)();
      } else if (Array.isArray(value)) {
        return ArrayType(constructor.elementType, value.length)(value);
      } else {
        throw new TypeError('argument of size undefined ArrayType constructor must be an array object or integer');
      }
    }

    if (arguments.length > 1) {
      throw new TypeError('size defined ArrayType constructor takes at most one argument');
    }

    if (!(this instanceof constructor))
      return new constructor(value);

    ArrayData.call(this, value);
  };

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
