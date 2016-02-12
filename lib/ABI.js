module.exports = ABI;

function ABI (abi, name) {
  this._abi = abi;
  this._name = name;
}

ABI.prototype.toString = function toString () {
  return this.toSource();
};

ABI.prototype.toSource = function toSource () {
  return 'ctypes.' + this._name;
};

ABI.prototype.valueOf = function valueOf () {
  return this._abi;
};
