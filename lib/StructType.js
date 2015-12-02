module.exports = StructType;

var CType = require('./CType');

var Struct = require('ref-struct');
var inherits = require('util').inherits;

function StructType (name, fields) {
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
  var self = new CType(type, name, StructType);
  return self;
}
inherits(StructType, CType);
