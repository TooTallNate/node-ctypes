module.exports = PointerType;

var CType = require('./CType');

var ref = require('ref');
var inherits = require('util').inherits;

function PointerType (targetType, name) {
  var type = ref.refType(targetType.type);
  var self = new CType(type, name, PointerType);

  // TODO: make read-only
  self.targetType = targetType;

  return self;
}
inherits(PointerType, CType);
