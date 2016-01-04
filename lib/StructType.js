module.exports = StructType;

var CType = require('./CType');
var inherits = require('./inherits');
var StructData = require('./StructData');

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
