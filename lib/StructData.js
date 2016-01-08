module.exports = StructData;

var CData = require('./CData');
var inherits = require('./inherits');
var _toSource = require('./toSource');

function StructData () {
  var argc = arguments.length;
  var numFields = this.constructor.length;
  //console.log(argc, numFields, arguments);

  if (!(argc === 0 || argc === 1 || argc === numFields)) {
    if (numFields >= 2) {
      throw new TypeError('StructType constructor takes 0, 1, or ' + numFields + ' arguments');
    } else {
      throw new TypeError('StructType constructor takes at most one argument');
    }
  }

  this._struct = new this.constructor.type();
  this._struct.ref().fill(0);
  if (argc > 0) {
    var fields = Object.keys(this.constructor._fields);
    for (var i = 0; i < arguments.length; i++) {
      this._struct[fields[i]] = arguments[i];
    }
  }
}
inherits(StructData, CData);

/**
 * Returns a new CData object of the appropriate pointer type, whose value points
 * to the specified field of the structure on which the method was called. See
 * Working with strings for more information on how to convert strings.
 */

StructData.prototype.addressOfField = function addressOfField (name) {
  if (arguments.length !== 1)
    throw new TypeError('StructType.prototype.addressOfField takes one argument');

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
