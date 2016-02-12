module.exports = toSource;

function toSource (val, _root) {
  var root = arguments.length > 1 ? _root: true;

  if (null == val)
    return String(val);

  if ('function' === typeof val.toSource) {
    return val.toSource();

  } else if (Array.isArray(val)) {
    return '[' + val.map(function (v) {
      return toSource(v, false);
    }).join(', ') + ']';

  } else if ('string' === typeof val) {
    return JSON.stringify(val);

  } else if ('object' === typeof val) {
    var str = '';
    if (root) str += '(';
    str += '{ ' + Object.keys(val).map(function (key) {
      return toSource(key, false) + ': ' + toSource(val[key], false);
    }).join(', ') + ' }';
    if (root) str += ')';
    return str;
  }

  return String(val);
}
