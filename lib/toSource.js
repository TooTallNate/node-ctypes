module.exports = toSource;

function toSource (val) {
  switch (typeof val) {
    case 'string':
      return '"' + val.replace(/\"/g, '\\"') + '"';
      break;
  }
  return String(val);
}
