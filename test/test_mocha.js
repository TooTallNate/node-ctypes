var assert = require('assert');
var tests = require('./test-jpm');

Object.keys(tests).forEach(function (name) {
  var parts = name.replace('test ', '').split('#');
  var title = parts.pop();

  var curr = exports;
  while (parts.length) {
    var next = parts.shift();
    if (!curr[next]) curr[next] = {};
    curr = curr[next];
  }

  curr[title] = function (done) {
    var test = tests[name];
    var async = test.length === 2;
    if (async) {
      test(assert, done);
    } else {
      test(assert);
      done();
    }
  };

});
