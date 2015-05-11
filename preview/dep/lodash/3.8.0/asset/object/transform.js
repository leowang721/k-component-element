define('lodash/object/transform', [
    '../internal/arrayEach',
    '../internal/baseCallback',
    '../internal/baseCreate',
    '../internal/baseForOwn',
    '../lang/isArray',
    '../lang/isFunction',
    '../lang/isObject',
    '../lang/isTypedArray'
], function (arrayEach, baseCallback, baseCreate, baseForOwn, isArray, isFunction, isObject, isTypedArray) {
    function transform(object, iteratee, accumulator, thisArg) {
        var isArr = isArray(object) || isTypedArray(object);
        iteratee = baseCallback(iteratee, thisArg, 4);
        if (accumulator == null) {
            if (isArr || isObject(object)) {
                var Ctor = object.constructor;
                if (isArr) {
                    accumulator = isArray(object) ? new Ctor() : [];
                } else {
                    accumulator = baseCreate(isFunction(Ctor) && Ctor.prototype);
                }
            } else {
                accumulator = {};
            }
        }
        (isArr ? arrayEach : baseForOwn)(object, function (value, index, object) {
            return iteratee(accumulator, value, index, object);
        });
        return accumulator;
    }
    return transform;
});