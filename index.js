/**
 * https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/js-ctypes_reference/ctypes
 */

var ffi = require('ffi');
var Library = require('./lib/Library');

exports.cast = cast;
exports.libraryName = libraryName;
exports.open = open;

/**
 * ABI:
 * https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/js-ctypes_reference/ABI
 *
 * Ported from:
 * https://dxr.mozilla.org/mozilla-central/source/js/src/ctypes/CTypes.cpp#6091
 */

exports.default_abi = ffi.FFI_DEFAULT_ABI;
exports.stdcall_abi = exports.winapi_abi = (function () {
  if (process.platform === 'win32') {
    if (process.arch === 'x64') {
      return ffi.FFI_WIN64;
    } else {
      return ffi.FFI_STDCALL;
    }
  } else {
    return ffi.FFI_DEFAULT_ABI;
  }
})();

/**
 * https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/js-ctypes_reference/ctypes#cast%28%29
 */

function cast (data, type) {
}

/**
 * Returns the correct platform-specific filename for a given library name (e.g.
 * libnss3.dylib for nss3 on OS X.)
 *
 * https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/js-ctypes_reference/ctypes#libraryName%28%29
 * https://dxr.mozilla.org/mozilla-central/source/js/src/ctypes/Library.cpp#51-81
 */

function libraryName (name) {
  return 'lib' + name + ffi.LIB_EXT;
}

/**
 * https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/js-ctypes_reference/ctypes#open()
 */

function open (libSpec) {
  return new Library(libSpec);
}

/**
 * The value of the latest system error. Similar to `errno` in libc, available
 * on all platforms. Cannot be set. Number.
 */

Object.defineProperty(exports, 'errno', {
  get: function () {
    return ffi.errno();
  },
  configurable: true,
  enumerable: true
});
