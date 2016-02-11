module.exports = StructType;

var CType = require('./CType');
var inherits = require('./inherits');
var _toSource = require('./toSource');
var StructData = require('./StructData');

var Struct = require('ref-struct');
var createFunction = require('function-class');
var invoke = require('function-class/invoke');

function StructType (name, fields) {
  if (!(arguments.length === 1 || arguments.length === 2))
    throw new TypeError('StructType takes one or two arguments');

  if ('string' !== typeof name)
    throw new TypeError('first argument of StructType must be a string');

  if (typeof this !== 'function')
    return createFunction(name, null, StructType, arguments);

  CType.call(this, new Struct());

  // `prototype` gets set to `undefined` initially,
  // and is reset once `define()` is called
  this._prototype = this.prototype;
  this.prototype = void(0);

  this.fields = void(0);
  this._fields = void(0);
  this._fieldNames = void(0);

  var constructor = this;
  this[invoke] = function () {
    if (isOpaque(constructor))
      throw new Error('cannot construct an opaque StructType');

    if (!(this instanceof constructor))
      return new (Function.prototype.bind.apply(constructor, arguments));

    StructData.apply(this, arguments);
  };

  if (arguments.length >= 2) {
    if (!Array.isArray(fields))
      throw new TypeError('second argument of StructType must be an array');

    this.define(fields);
  }
}
inherits(StructType, CType);

/**
 * Defines a previously declared opaque type's fields. This lets you
 * convert an opaque structure type into a defined structure type.
 */

StructType.prototype.define = function define (fields) {
  if (arguments.length !== 1)
    throw new TypeError('StructType.prototype.define takes one argument');

  if (!Array.isArray(fields))
    throw new TypeError('argument of StructType.prototype.define must be an array');

  if (!isOpaque(this))
    throw new Error('StructType has already been defined');

  var struct = this.type;
  var ownFields = this._fields = Object.create(null);
  var formattedFields = new Array(fields.length);
  var fieldNames = this._fieldNames = new Array(fields.length);

  // restore original `prototype` and inherit from `StructData`
  var proto = this.prototype = this._prototype;
  this._prototype = null;
  inherits(this, StructData);

  fields.forEach(function (field, i) {
    var name = Object.keys(field)[0];
    var type = field[name];

    ownFields[name] = type;
    fieldNames[i] = name;

    var o = {};
    o[name] = type;
    formattedFields[i] = o;

    struct.defineProperty(name, type.type);

    Object.defineProperty(proto, name, {
      enumerable: true,
      configurable: true,
      get: function () {
        return this._struct[name];
      },
      set: function (v) {
        return this._struct[name] = v;
      }
    });
  });

  Object.defineProperty(this, 'fields', {
    value: formattedFields,
    writable: false,
    enumerable: true,
    configurable: true
  });
};

Object.defineProperty(StructType.prototype, 'fields', {
  value: void(0),
  writable: false,
  enumerable: true,
  configurable: true
});

StructType.prototype.toSource = function toSource () {
  var fieldsStr;
  var fields = this.fields;
  if (fields) {
    fieldsStr = ', ' + _toSource(fields);
  } else {
    fieldsStr = '';
  }

  return 'ctypes.StructType(' + _toSource(this.name) + fieldsStr + ')';
};

/**
 * Returns `true` if no fields have been defined on the struct type yet
 * (and is thus an "opaque structure"), or `false` otherwise.
 */

function isOpaque (structType) {
  return !structType._fields;
}
