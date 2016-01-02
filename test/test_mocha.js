var assert = require('assert');
var tests = require('./test-jpm');

// make sure `assert` is not a Function, to match the `jpm test` env
function Assert() {}
Object.keys(assert).forEach(function (name) {
  Assert.prototype[name] = assert[name];
});

Object.keys(tests).forEach(function (_name) {
  if (!/^test /.test(_name)) return;

  var name = _name.substring(5);
  var part = name.match(/^(.*?)([ \#\.])(.*?)$/);
  var base = part[1];
  var title = part[3];

  if (!exports[base]) {
    exports[base] = {};
  }

  exports[base][title] = function (done) {
    var test = tests[_name];
    var async = test.length === 2;
    if (async) {
      test(new Assert(), done);
    } else {
      test(new Assert());
      done();
    }
  };

});
