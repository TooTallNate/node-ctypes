module.exports = StructType;

var CData = require('./CData');
var CType = require('./CType');
var inherits = require('./inherits');

var ref = require('ref');
var Struct = require('ref-struct');
var createFunction = require('function-class');

function StructType (name, fields) {
  if (typeof this !== 'function')
    return createFunction(name, null, StructType, arguments);

  var type;
  if (fields) {
    if (!Array.isArray(fields)) {
      throw new TypeError('an Array is required for `fields`');
    }
    var refFields = [];
    fields.forEach(function (field) {
      Object.keys(field).forEach(function (name) {
        refFields.push([ field[name].type, name ]);
      });
    });
    //console.log(refFields);
    type = new Struct(refFields);
  } else {
    type = ref.types.pointer;
  }

  CType.call(this, type);
}
inherits(StructType, CType);

StructType.prototype.toSource = function toSource () {
  return this.name;
};



function StructData (type, value) {
  CData.call(this, type, value);
  this._value = ref.deref(this._buffer);
}
inherits(StructData, CData);

StructData.prototype.toSource = function toSource () {
  var val = this._value;
  var vals = Object.keys(val.constructor.fields).map(function (key) {
    return val[key];
  });
  return this.constructor.toSource() + '('
    + vals.join(', ') + ')';
};
