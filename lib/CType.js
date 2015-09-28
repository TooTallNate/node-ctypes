
module.exports = CType;

function CType () {
}

Object.defineProperty(CType.prototype, 'ptr', {
  enumerable: true,
  configurable: true,
  get: function () {
    return PointerType(this);
  }
});

/**
 * https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/js-ctypes_reference/CType#array()
 */
CType.prototype.array = function array (n) {
  return ArrayType(this, n);
}

/**
 * Returns a string identifying the type. The format of this string is
 * "type " + name.
 *
 * https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/js-ctypes_reference/CType#toString()
 */

CType.prototype.toString = function toString () {
  return 'type ' + this.name;
};
