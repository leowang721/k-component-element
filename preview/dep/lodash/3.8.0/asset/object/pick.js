define('lodash/object/pick', [
    '../internal/baseFlatten',
    '../internal/bindCallback',
    '../internal/pickByArray',
    '../internal/pickByCallback',
    '../function/restParam'
], function (baseFlatten, bindCallback, pickByArray, pickByCallback, restParam) {
    var pick = restParam(function (object, props) {
            if (object == null) {
                return {};
            }
            return typeof props[0] == 'function' ? pickByCallback(object, bindCallback(props[0], props[1], 3)) : pickByArray(object, baseFlatten(props));
        });
    return pick;
});