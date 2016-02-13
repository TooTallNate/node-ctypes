module.exports = FunctionPointerType;

var inherits = require('./inherits');
var PointerType = require('./PointerType');
var FunctionPointerData = require('./FunctionPointerData');

var createFunction = require('function-class');
var invoke = require('function-class/invoke');

function FunctionPointerType (functionType) {
  var name = functionType.returnType.name + '(*)(' + functionType.argTypes.map(function (argType) {
    return argType.name;
  }).join(', ') + ')';

  if (typeof this !== 'function')
    return createFunction(name, 0, FunctionPointerType, arguments);

  PointerType.call(this, functionType, name);

  inherits(this, FunctionPointerData);

  // If two arguments are passed to the callback constructor, the second is used
  // as the this parameter:
  // If three arguments are passed to the callback constructor, the third argument
  // is used as a sentinel value which the callback returns if an exception is
  // thrown.
  var constructor = this;
  this[invoke] = function (value, thisArg, sentinel) {
    if (!(typeof this === 'function' && this instanceof constructor))
      return createFunction(null, 0, constructor, arguments);
    FunctionPointerData.call(this, value, thisArg, sentinel);
  };
}
inherits(FunctionPointerType, PointerType);
