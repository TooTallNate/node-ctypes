module.exports = StructData;

var CData = require('./CData');
var inherits = require('./inherits');

function StructData (value) {
  CData.call(this, value);
  this._value = ref.deref(this._buffer);
}
inherits(StructData, CData);

StructData.prototype.toSource = function toSource () {
  var val = this._value;
  var vals = Object.keys(val.constructor.fields).map(function (key) {
    return val[key];
  });
  return this.constructor.toSource() + '(' + vals.join(', ') + ')';
};
