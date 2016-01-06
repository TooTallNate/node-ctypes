module.exports = StructType;

var CType = require('./CType');
var inherits = require('./inherits');
var _toSource = require('./toSource');
var StructData = require('./StructData');

var ref = require('ref');
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

  inherits(this, StructData);

  this._fields = null;

  var constructor = this;
  this[invoke] = function (value) {
    if (!(this instanceof constructor))
      return new constructor(value);
    StructData.call(this, value);
  };

  if (arguments.length >= 2) {
    if (!Array.isArray(fields))
      throw new TypeError('second argument of StructType must be an array');

    this.define(fields);
  }
}
inherits(StructType, CType);

StructType.prototype.define = function define (fields) {
  if (arguments.length !== 1)
    throw new TypeError('StructType.prototype.define takes one argument');

  if (!Array.isArray(fields))
    throw new TypeError('argument of StructType.prototype.define must be an array');

  var struct = this.type;
  var ownFields = this._fields;

  if (ownFields)
    throw new Error('StructType has already been defined');

  ownFields = this._fields = [];
  var proto = this.prototype;

  fields.forEach(function (field) {
    var name = Object.keys(field)[0];
    var type = field[name];

    var o = {};
    o[name] = type;
    ownFields.push(o);

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
};

StructType.prototype.toSource = function toSource () {
  return 'ctypes.StructType(' + _toSource(this.name) +
    ', ' +  _toSource(this._fields) + ')';
};
