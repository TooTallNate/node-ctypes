module.exports = FunctionPointerData;

var inherits = require('./inherits');
var PointerData = require('./PointerData');

var invoke = require('function-class/invoke');

function FunctionPointerData (value, thisArg, sentinel) {
  var ffiFn = this.constructor.targetType.type;

  if ('function' === typeof value) {
    value = ffiFn.toPointer(value);
  }

  PointerData.call(this, value);
}
inherits(FunctionPointerData, PointerData);

FunctionPointerData.prototype[invoke] = function () {
  var fn = this._fn;
  if (!fn) {
    fn = this._fn = this.constructor.targetType.type.toFunction(this._buffer);
  }
  return fn.apply(null, arguments);
};
