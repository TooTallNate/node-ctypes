var assert = require('assert');
var tests = require('./test-jpm');

describe('ctypes', function () {

  Object.keys(tests).forEach(function (name) {

    it(name, function (done) {
      var test = tests[name];
      var async = test.length === 2;
      if (async) {
        test(assert, done);
      } else {
        test(assert);
        done();
      }
    });

  });

});
