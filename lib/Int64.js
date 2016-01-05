module.exports = Int64;

var ref = require('ref');

function Int64 (value) {
  if (arguments.length !== 1)
    throw new TypeError('Int64 constructor takes one argument');

  if (!(this instanceof Int64))
    return new Int64(value);

  this._buffer = ref.alloc(this.constructor.refType, value);
}

Int64.refType = ref.types.int64;

Int64.prototype.toSource = function toSource () {
  return 'ctypes.' + this.constructor.name + '("' + this.toString() + '")';
};

Int64.prototype.toString = function toString (radix) {
  // TODO: support `radix`
  return ref.deref(this._buffer).toString();
};

// static functions
Int64.compare = function compare (a, b) {
};

Int64.join = function join (high, low) {
  var i = new this(0);
  ref.set(i._buffer, 0, low, ref.types.int32);
  ref.set(i._buffer, 4, high, ref.types.int32);
  return i;
};

Int64.hi = function hi (a) {
  return ref.get(a._buffer, 4, ref.types.int32);
};

Int64.lo = function lo (a) {
  return ref.get(a._buffer, 0, ref.types.uint32);
};
