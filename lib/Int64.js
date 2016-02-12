module.exports = Int64;

var Long = require('long');

function Int64 (value) {
  if (arguments.length !== 1)
    throw new TypeError('Int64 constructor takes one argument');

  if (!(this instanceof Int64))
    return new Int64(value);

  //console.log(value);
  if ('string' === typeof value) {
    this._long = Long.fromString(value, !this.constructor._signed, 16);
  } else {
    throw new Error('unsupported!');
  }
}

Int64._signed = true;

Int64.prototype.toSource = function toSource () {
  return 'ctypes.' + this.constructor.name + '("' + this.toString() + '")';
};

Int64.prototype.toString = function toString (radix) {
  return this._long.toString(radix);
};

// static functions
Int64.compare = function compare (a, b) {
  return a._long.compare(b._long);
};

Int64.join = function join (high, low) {
  var i = Object.create(this.prototype);
  i._long = new Long(low, high, !this._signed);
  return i;
};

Int64.hi = function hi (a) {
  return a._long.high;
};

Int64.lo = function lo (a) {
  return a._long.low;
};
