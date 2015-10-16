/*
 * rubyfy.js make your javascript look like ruby
 * Written in 2015 by Ramiro Rojo <ramiro.rojo.cretta@gmail.com>
 *
 * To the extent possible under law, the author(s) have dedicated all copyright 
 * and related and neighboring rights to this software to the public  * domain 
 * worldwide. This software is distributed without any warranty.
 * You should have received a copy of the CC0 Public Domain Dedication along 
 * with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */
(function(world) {

/**
 * Extends a, existing 'class' Object, creating it like ruby classes.
 * This also adds the super property to the class.
 *
 * @param parent [optional] The parent class (Object by default)
 * @return A new class extending the desired parent.
 */
function extend(/* [ parent ] */) {
  var parent = arguments.length > 0 ? arguments[0] : Object;

  function makeSuper(obj, proto) {
    var sup = {};
    var supProto = Object.getPrototypeOf(proto);
    if (supProto !== Object.prototype) {
      sup.super = makeSuper(obj, supProto);
    }
    for (var p in proto) {
      if (typeof proto[p] == 'function') {
        sup[p] = function () {
          var _super = obj.super;
          if (proto[p] === supProto[p]) {
            obj.super = sup.super.super;
          } else {
            obj.super = sup.super;
          }
          proto[p].apply(obj, arguments);
          obj.super = _super;
        }
      }
    }

    return sup;
  }

  function makePrototype() {
    var result = Object.create(parent.prototype);
    return result;
  }

  function constructor () {
    this.super = makeSuper(this, parent.prototype);
    this.initialize.apply(this, arguments);
  };

  constructor.prototype = makePrototype();
  constructor.prototype.constructor = constructor;

  constructor.extend = function () {
    return extend(constructor);
  };

  return constructor;
}

/**
 * Provides an easy way to create a read only property for an object.
 * By default it uses as private a variable with as '_' + name
 *
 * @param obj The object to add the read only property
 * @param name The name of the property
 */
function reader(obj, name /* [, getter]*/) {
  var getter = arguments.length > 2 ? arguments[2] : reader.makeDefault(name);
  Object.defineProperty(obj, name, { get: getter, configurable: true });
}

reader.makeDefault = function (name) {
  return function () { return this['_' + name]; };
};

/**
 * Provides an easy way to create a write only property for an object.
 * By default it uses as private a variable with as '_' + name
 * If the object has a method called _refresh it will be called when the
 * property is set by default.
 *
 * @param obj The object to add the write only property
 * @param name The name of the property
 */
function writer(obj, name /* [, setter]*/) {
  var setter = arguments.length > 2 ? arguments[2] : writer.makeDefault(name);
  Object.defineProperty(obj, name, { set: setter, configurable: true });
}

writer.makeDefault = function (name) {
  var id = '_' + name;
  return function (value) {
    if (this[id] !== value) {
      this[id] = value;
      if (this._refresh) {
        this._refresh();
      }
    }
  };
};

/**
 * Provides an easy way to create a custom property for an object.
 * By default it uses the reader and writer's defaults
 *
 * @param obj The object to add the read only property
 * @param name The name of the property
 * @see reader()
 * @see writer()
 */
function accessor(obj, name /* [, setter [, getter]]*/) {
  var setter = arguments.length > 2 ? arguments[2] : writer.makeDefault(name);
  var getter = arguments.length > 3 ? arguments[3] : reader.makeDefault(name);
  Object.defineProperty(obj, name, { get: getter, set: setter, configurable: true });
}

// Exporting functions to window or an empty object

world.extend   = extend;
world.reader   = reader;
world.writer   = writer;
world.accessor = accessor;

// Node.js export
if( typeof exports !== 'undefined' ) {
  if( typeof module !== 'undefined' && module.exports ) {
    exports = module.exports = world;
  }
  exports = world;
}

})(window || {});