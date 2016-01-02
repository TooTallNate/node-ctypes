
/**
 * https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/js-ctypes_reference/ctypes
 */

var ref = require('ref');
var ffi = require('ffi');
var CType = require('./CType');
var Library = require('./Library');

exports.CType = require('./CType');
exports.CData = require('./CData');
exports.PointerType = require('./PointerType');
exports.ArrayType = require('./ArrayType');
exports.StructType = require('./StructType');
//exports.FunctionType = require('./FunctionType');
exports.Int64 = require('./Int64');
exports.UInt64 = require('./UInt64');
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
 * Casts the specified CData object to a new type, returning a new CData object
 * representing the value in the new type.
 *
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
  get: function errno () {
    return ffi.errno();
  },
  configurable: true,
  enumerable: true
});

/**
 * Built-in types.
 *
 * https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/js-ctypes_reference/ctypes#Predefined_data_types
 */

// Primitive types
exports.int8_t    = CType(ref.types.int8, 'int8_t');
exports.uint8_t   = CType(ref.types.uint8, 'uint8_t');
exports.int16_t   = CType(ref.types.int16, 'int16_t');
exports.uint16_t  = CType(ref.types.uint16, 'uint16_t');
exports.int32_t   = CType(ref.types.int32, 'int32_t');
exports.uint32_t  = CType(ref.types.uint32, 'uint32_t');
exports.int64_t   = CType(ref.types.int64, 'int64_t');
exports.uint64_t  = CType(ref.types.uint64, 'uint64_t');
exports.float32_t = CType(ref.types.float, 'float32_t');
exports.float64_t = CType(ref.types.double, 'float64_t');

// Types that act like specific C types
exports.bool               = CType(ref.types.bool);
exports.short              = CType(ref.types.short);
exports.unsigned_short     = CType(ref.types.ushort, 'unsigned_short');
exports.int                = CType(ref.types.int);
exports.unsigned_int       = CType(ref.types.uint, 'unsigned_int');
exports.long               = CType(ref.types.long);
exports.unsigned_long      = CType(ref.types.ulong, 'unsigned_long');
exports.long_long          = CType(ref.types.longlong, 'long_long');
exports.unsigned_long_long = CType(ref.types.ulonglong, 'unsigned_long_long');
exports.float              = CType(ref.types.float);
exports.double             = CType(ref.types.double);

// Character types
exports.char          = CType(ref.types.char);
exports.signed_char   = CType(ref.types.char, 'signed_char');
exports.unsigned_char = CType(ref.types.uchar, 'unsigned_char');

// Types whose size varies depending on platform
// (Because it's unknown whether these values will be 32-bit or 64-bit, they are
// not automatically converted into JavaScript numbers. Instead, these convert
// into ctypes.Int64 or ctypes.UInt64 JavaScript objects; see 64-bit integers for
// details.)
//exports.size_t
//exports.ssize_t
//exports.intptr_t
//exports.uintptr_t

// JavaScript characters
// 16-bit C Unicode characters are handled by js-ctypes using the jschar type.
//exports.jschar = CType();

// Special C types
exports.void_t    = CType(ref.types.void, 'void_t');
exports.voidptr_t = exports.void_t.ptr;
