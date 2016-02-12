module.exports = Int64;

var Long = require('long');

var _toSource = require('./toSource');

function Int64 (value) {
  if (arguments.length !== 1)
    throw new TypeError('Int64 constructor takes one argument');

  if (!(this instanceof Int64))
    return new Int64(value);

  if ('string' === typeof value && value.indexOf('.') === -1) {
    var radix = /\-?0x/i.test(value) ? 16 : 10;
    this._long = Long.fromString(value, !this.constructor._signed, radix);
  } else if (isInteger(value)) {
    this._long = Long.fromNumber(value, !this.constructor._signed);
  } else {
    throw new TypeError('can\'t pass the ' + (typeof value) + ' ' + _toSource(value) + ' to argument 1 of ' + this.constructor.name);
  }
}

Int64._signed = true;

Int64.prototype.toSource = function toSource () {
  return 'ctypes.' + this.constructor.name + '(' + _toSource(this.toString()) + ')';
};

Int64.prototype.toString = function toString (radix) {
  return this._long.toString(radix);
};

// static functions
Int64.compare = function compare (a, b) {
  if (arguments.length !== 2) {
    throw new TypeError(this.name + '.compare takes two arguments');
  }
  if (!(a instanceof this)) {
    a = new this(a);
  }
  if (!(b instanceof this)) {
    b = new this(b);
  }
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
  return a._long.low >>> 0;
};


var isInteger = Number.isInteger || function (value) {
  return typeof value === "number" &&
    isFinite(value) &&
    Math.floor(value) === value;
}
