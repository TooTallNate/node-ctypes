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
};

StructData.prototype.toSource = function toSource () {
  var struct = this._struct;
  var vals = Object.keys(struct.constructor.fields).map(function (key) {
    return _toSource(struct[key]);
  });
  return this.constructor.name + '(' + vals.join(', ') + ')';
};
