module.exports = UInt64;

var Int64 = require('./Int64');

var ref = require('ref');
var inherits = require('./inherits');

function UInt64 (value) {
  if (!(this instanceof UInt64)) return new UInt64(value);
  Int64.call(this, value);
}
inherits(UInt64, Int64);

UInt64.refType = ref.types.uint64;

UInt64.compare = Int64.compare;
UInt64.join = Int64.join;
UInt64.hi = Int64.hi;
UInt64.lo = Int64.lo;
