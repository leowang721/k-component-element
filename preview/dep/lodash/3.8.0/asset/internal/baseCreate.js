define('lodash/internal/baseCreate', [
    '../lang/isObject',
    './root'
], function (isObject, root) {
    var baseCreate = function () {
            function Object() {
            }
            return function (prototype) {
                if (isObject(prototype)) {
                    Object.prototype = prototype;
                    var result = new Object();
                    Object.prototype = null;
                }
                return result || root.Object();
            };
        }();
    return baseCreate;
});