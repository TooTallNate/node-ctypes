var ffi = require('ffi');

module.exports = Library;

/**
 * The Library object represents a native library loaded by the ctypes open()
 * method. Its methods let you declare symbols exported by the library, and to
 * manage the library.
 */

function Library (libSpec) {
  this.lib = ffi.DynamicLibrary(libSpec);
}

/**
 * https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/js-ctypes_reference/Library#close()
 */

Library.prototype.close = function close () {
  this.lib.close();
};

/**
 * https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/js-ctypes_reference/Library#declare()
 */

Library.prototype.declare = function declare (name, abi, returnType/*, argType1, ...*/) {
  var symbol = this.lib.get(name);
  var argTypes = [];
  for (var i = 3; i < arguments.length; i++) {
    argTypes.push(arguments[i]);
  }
  //console.log(argTypes);
  var types = argTypes.map(function (t) {
    //console.log(t);
    return t.type;
  });
  //console.log(symbol, returnType.type, types, abi);
  var fn = ffi.ForeignFunction(symbol, returnType.type, types, +abi);
  return fn;
};
