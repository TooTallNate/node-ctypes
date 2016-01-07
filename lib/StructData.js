module.exports = StructData;

var CData = require('./CData');
var inherits = require('./inherits');
var _toSource = require('./toSource');

function StructData (value) {
  if ('undefined' === typeof value) {
    this._struct = new this.constructor.type();
    this._struct.ref().fill(0);
  } else {
    this._struct = new this.constructor.type(value);
  }
}
inherits(StructData, CData);

/**
 * Returns a new CData object of the appropriate pointer type, whose value points
 * to the specified field of the structure on which the method was called. See
 * Working with strings for more information on how to convert strings.
 */

StructData.prototype.addressOfField = function addressOfField (name) {
  var field = this.constructor.type.fields[name];
  if (!field)
    throw new Error(name + ' does not name a field');

  var type = this.constructor._fields[name];
  var start = field.offset;
  var end = start + type.size;
  var buffer = this._struct.ref().slice(start, end);
  return type.ptr(buffer);
};

StructData.prototype.toSource = function toSource () {
  var struct = this._struct;
  var vals = Object.keys(struct.constructor.fields).map(function (key) {
    return _toSource(struct[key]);
  });
  return this.constructor.name + '(' + vals.join(', ') + ')';
};
