module.exports = Int64;

var ref = require('ref');

function Int64 (value) {
  if (!(this instanceof Int64)) return new Int64(value);
  this._buffer = ref.alloc(this.constructor.refType, value);
  this._value = value;
}

Int64.refType = ref.types.int64;

Int64.prototype.toSource = function toSource () {
  return 'ctypes.' + this.constructor.name + '("' + this.toString() + '")';
};

Int64.prototype.toString = function toString (radix) {
  return ref.deref(this._buffer).toString();
};

// static functions
Int64.compare = function compare (a, b) {
};

Int64.join = function join (high, low) {
};

Int64.hi = function hi (a) {
  return ref.get(a._buffer, 4, ref.types.int32);
};

Int64.lo = function lo (a) {
  return ref.get(a._buffer, 0, ref.types.uint32);
};
