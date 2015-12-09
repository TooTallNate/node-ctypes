var assert = require('assert');
var tests = require('./test-jpm');

// make sure `assert` is not a Function, to match the `jpm test` env
function Assert() {}
Object.keys(assert).forEach(function (name) {
  Assert.prototype[name] = assert[name];
});

Object.keys(tests).forEach(function (name) {
  if (!/^test /.test(name)) return;

  var parts = name.substring(5).split('#');
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
      test(new Assert(), done);
    } else {
      test(new Assert());
      done();
    }
  };

});
