
module.exports = PointerType;

var ref = require('ref');
var CType = require('./CType');
var inherits = require('util').inherits;

function PointerType (targetType, name) {
  var type = ref.refType(targetType.type);
  CType.call(this, type, name);

  // TODO: make read-only
  this.targetType = targetType;
}
inherits(PointerType, CType);
