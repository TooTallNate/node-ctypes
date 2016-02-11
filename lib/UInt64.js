module.exports = UInt64;

var Int64 = require('./Int64');
var inherits = require('./inherits');
var toSource = require('./toSource');

function UInt64 (value) {
  if (arguments.length !== 1)
    throw new TypeError('UInt64 constructor takes one argument');

  if (value < 0)
    throw new TypeError('can\'t pass the ' + (typeof value) + ' ' + toSource(value) + ' to argument 1 of UInt64');

  if (!(this instanceof UInt64))
    return new UInt64(value);

  Int64.call(this, value);
}
inherits(UInt64, Int64);

UInt64._signed = false;

UInt64.compare = Int64.compare;
UInt64.join = Int64.join;

UInt64.hi = function hi (a) {
  return ref.get(a._buffer, 4, ref.types.uint32);
};

UInt64.lo = Int64.lo;
