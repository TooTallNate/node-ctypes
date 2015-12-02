module.exports = Int64;

function Int64 (value) {

}

Int64.prototype.toSource = function toSource () {
  return 'ctypes.' + this.constructor.name + '("' + this.toString() + '")';

};

Int64.prototype.toString = function toString (radix) {

};

// static functions
Int64.compare = function compare (a, b) {
};

Int64.join = function join (high, low) {
};

Int64.hi = function hi (a) {
};

Int64.lo = function lo (a) {
};
