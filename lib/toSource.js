module.exports = toSource;

function toSource (val) {
  if (null == val)
    return String(val);

  if ('function' === typeof val.toSource) {
    return val.toSource();

  } else if (Array.isArray(val)) {
    return '[' + val.map(toSource).join(', ') + ']';

  } else if ('string' === typeof val) {
    return JSON.stringify(val);

  } else if ('object' === typeof val) {
    return '{ ' + Object.keys(val).map(function (key) {
      return toSource(key) + ': ' + toSource(val[key]);
    }).join(', ') + ' }';
  }

  return String(val);
}
