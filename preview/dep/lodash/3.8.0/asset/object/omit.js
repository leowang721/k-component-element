define('lodash/object/omit', [
    '../internal/arrayMap',
    '../internal/baseDifference',
    '../internal/baseFlatten',
    '../internal/bindCallback',
    './keysIn',
    '../internal/pickByArray',
    '../internal/pickByCallback',
    '../function/restParam'
], function (arrayMap, baseDifference, baseFlatten, bindCallback, keysIn, pickByArray, pickByCallback, restParam) {
    var omit = restParam(function (object, props) {
            if (object == null) {
                return {};
            }
            if (typeof props[0] != 'function') {
                var props = arrayMap(baseFlatten(props), String);
                return pickByArray(object, baseDifference(keysIn(object), props));
            }
            var predicate = bindCallback(props[0], props[1], 3);
            return pickByCallback(object, function (value, key, object) {
                return !predicate(value, key, object);
            });
        });
    return omit;
});