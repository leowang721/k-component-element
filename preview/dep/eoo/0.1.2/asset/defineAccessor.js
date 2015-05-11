void function (define, undefined) {
    define('eoo/defineAccessor', ['require'], function (require) {
        var MEMBERS = '__eooPrivateMembers__';
        function simpleGetter(name) {
            var body = 'return typeof this.' + MEMBERS + ' === \'object\' ? this.' + MEMBERS + '[\'' + name + '\'] : undefined;';
            return new Function(body);
        }
        function simpleSetter(name) {
            var body = 'this.' + MEMBERS + ' = this.' + MEMBERS + ' || {};\n' + 'this.' + MEMBERS + '[\'' + name + '\'] = value;';
            return new Function('value', body);
        }
        return function (obj, name, accessor) {
            var upperName = name.charAt(0).toUpperCase() + name.slice(1);
            var getter = 'get' + upperName;
            var setter = 'set' + upperName;
            if (!accessor) {
                obj[getter] = !accessor || typeof accessor.get !== 'function' ? simpleGetter(name) : accessor.get;
                obj[setter] = !accessor || typeof accessor.set !== 'function' ? simpleSetter(name) : accessor.set;
            } else {
                typeof accessor.get === 'function' && (obj[getter] = accessor.get);
                typeof accessor.set === 'function' && (obj[setter] = accessor.set);
            }
        };
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
});