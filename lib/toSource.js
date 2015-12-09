module.exports = toSource;

function toSource (val) {
  if (null == val) return String(val);
  switch (typeof val) {
    case 'string':
      return '"' + val.replace(/\"/g, '\\"') + '"';
      break;
    default:
      return String(val);
      break;
  }
}
