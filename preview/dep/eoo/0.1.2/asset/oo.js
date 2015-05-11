void function (define) {
    define('eoo/oo', [], function () {
        var Empty = function () {
        };
        var NAME_PROPERTY_NAME = '__eooName__';
        var OWNER_PROPERTY_NAME = '__eooOwner__';
        function Class() {
            return Class.create.apply(Class, arguments);
        }
        Class.create = function (BaseClass, overrides) {
            overrides = overrides || {};
            BaseClass = BaseClass || Class;
            if (typeof BaseClass === 'object') {
                overrides = BaseClass;
                BaseClass = Class;
            }
            var kclass = inherit(BaseClass);
            var proto = kclass.prototype;
            eachObject(overrides, function (value, key) {
                if (typeof value === 'function') {
                    value[NAME_PROPERTY_NAME] = key;
                    value[OWNER_PROPERTY_NAME] = kclass;
                }
                proto[key] = value;
            });
            kclass.toString = toString;
            return kclass;
        };
        Class.static = typeof Object.create === 'function' ? Object.create : function (o) {
            if (arguments.length > 1) {
                throw new Error('Second argument not supported');
            }
            if (!(o instanceof Object)) {
                throw new TypeError('Argument must be an object');
            }
            Empty.prototype = o;
            return new Empty();
        };
        Class.toString = function () {
            return 'function Class() { [native code] }';
        };
        Class.prototype = {
            constructor: function () {
            },
            $self: Class,
            $superClass: Object,
            $super: function (args) {
                var method = this.$super.caller;
                var name = method[NAME_PROPERTY_NAME];
                var superClass = method[OWNER_PROPERTY_NAME].$superClass;
                var superMethod = superClass.prototype[name];
                if (typeof superMethod !== 'function') {
                    throw new TypeError('Call the super class\'s ' + name + ', but it is not a function!');
                }
                return superMethod.apply(this, args);
            }
        };
        function inherit(BaseClass) {
            var kclass = function () {
                return kclass.prototype.constructor.apply(this, arguments);
            };
            Empty.prototype = BaseClass.prototype;
            var proto = kclass.prototype = new Empty();
            proto.$self = kclass;
            if (!('$super' in proto)) {
                proto.$super = Class.prototype.$super;
            }
            kclass.$superClass = BaseClass;
            return kclass;
        }
        var hasEnumBug = !{ toString: 1 }.propertyIsEnumerable('toString');
        var enumProperties = [
                'constructor',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'toString',
                'toLocaleString',
                'valueOf'
            ];
        function hasOwnProperty(obj, key) {
            return Object.prototype.hasOwnProperty.call(obj, key);
        }
        function eachObject(obj, fn) {
            for (var k in obj) {
                hasOwnProperty(obj, k) && fn(obj[k], k, obj);
            }
            if (hasEnumBug) {
                for (var i = enumProperties.length - 1; i > -1; --i) {
                    var key = enumProperties[i];
                    hasOwnProperty(obj, key) && fn(obj[key], key, obj);
                }
            }
        }
        function toString() {
            return this.prototype.constructor.toString();
        }
        return Class;
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
});