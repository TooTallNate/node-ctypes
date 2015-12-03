// cause `jpm test`
if (typeof process == 'object') {
  // nodejs
  var ctypes = module.exports = require('./lib/index');
} else {
  // jpm
  var self = require('sdk/self');
  var chrome = require('chrome');
  chrome.Cu.import('resource://gre/modules/ctypes.jsm');
}


var i = ctypes.Int64('-0x123456789000');
console.log(i.toSource());
console.log(i.toString(16));
console.log(ctypes.Int64.hi(i));
console.log(ctypes.Int64.lo(i));
