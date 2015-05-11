define('lodash/internal/baseMerge', [
    './arrayEach',
    './baseMergeDeep',
    './getSymbols',
    '../lang/isArray',
    './isArrayLike',
    '../lang/isObject',
    './isObjectLike',
    '../lang/isTypedArray',
    '../object/keys'
], function (arrayEach, baseMergeDeep, getSymbols, isArray, isArrayLike, isObject, isObjectLike, isTypedArray, keys) {
    var undefined;
    var arrayProto = Array.prototype;
    var push = arrayProto.push;
    function baseMerge(object, source, customizer, stackA, stackB) {
        if (!isObject(object)) {
            return object;
        }
        var isSrcArr = isArrayLike(source) && (isArray(source) || isTypedArray(source));
        if (!isSrcArr) {
            var props = keys(source);
            push.apply(props, getSymbols(source));
        }
        arrayEach(props || source, function (srcValue, key) {
            if (props) {
                key = srcValue;
                srcValue = source[key];
            }
            if (isObjectLike(srcValue)) {
                stackA || (stackA = []);
                stackB || (stackB = []);
                baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
            } else {
                var value = object[key], result = customizer ? customizer(value, srcValue, key, object, source) : undefined, isCommon = result === undefined;
                if (isCommon) {
                    result = srcValue;
                }
                if ((isSrcArr || result !== undefined) && (isCommon || (result === result ? result !== value : value === value))) {
                    object[key] = result;
                }
            }
        });
        return object;
    }
    return baseMerge;
});