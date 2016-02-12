module.exports = FunctionType;

var CType = require('./CType');
var inherits = require('./inherits');
var _toSource = require('./toSource');

var ffi = require('ffi');
var createFunction = require('function-class');
var invoke = require('function-class/invoke');

/**
 * FunctionType represents C arrays.
 */

function FunctionType (abi, returnType, argTypes) {
  var name = returnType.name + '(' + argTypes.map(function (argType) {
    return argType.name;
  }).join(', ') + ')';

  if (typeof this !== 'function')
    return createFunction(name, 0, FunctionType, arguments);

  var returnRefType = returnType.type;
  var argRefTypes = argTypes.map(function (argType) { return argType.type; });
  var refType = new ffi.Function(returnRefType, argRefTypes, +abi);
  CType.call(this, refType);

  this[invoke] = function () {
    throw new Error('cannot construct from FunctionType; use FunctionType.ptr instead');
  };

  // XXX: make these Read only.
  this.abi = abi;
  this.returnType = returnType;
  this.argTypes = argTypes;
}
inherits(FunctionType, CType);

Object.defineProperty(FunctionType.prototype, 'size', {
  value: void(0)
});

FunctionType.prototype.toSource = function toSource () {
  var args = [ this.abi, this.returnType, this.argTypes ];
  return 'ctypes.FunctionType(' + args.map(function (arg) {
    return _toSource(arg);
  }).join(', ') + ')';
};
