module.exports = PointerType;

var CType = require('./CType');
var inherits = require('./inherits');
var PointerData = require('./PointerData');

var ref = require('ref');
var WeakMap = require('es6-weak-map');
var createFunction = require('function-class');
var invoke = require('function-class/invoke');

// we cache instances based on the base type so that `foo.ptr === foo.ptr` works
var instances = new WeakMap();

function PointerType (targetType) {
  var instance = instances.get(targetType);
  if (instance) return instance;

  var name = targetType.name + '*';

  if (typeof this !== 'function')
    return createFunction(name, null, PointerType, arguments);

  var type = ref.refType(targetType.type);
  CType.call(this, type);

  inherits(this, PointerData);

  var constructor = this;
  this[invoke] = function (value) {
    if (!(this instanceof constructor))
      return new constructor(value);
    PointerData.call(this, value);
  };

  // TODO: make read-only
  this.targetType = targetType;

  instances.set(targetType, this);
}
inherits(PointerType, CType);

PointerType.prototype.size = ref.sizeof.pointer;

PointerType.prototype.toSource = function toSource () {
  return this.targetType.toSource() + '.ptr';
};
