module.exports = UInt64;

var Int64 = require('./Int64');

var ref = require('ref');
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

UInt64.refType = ref.types.uint64;

UInt64.compare = Int64.compare;
UInt64.join = Int64.join;
UInt64.hi = Int64.hi;
UInt64.lo = Int64.lo;
