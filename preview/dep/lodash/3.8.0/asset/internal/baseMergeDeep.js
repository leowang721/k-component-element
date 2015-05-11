define('lodash/internal/baseMergeDeep', [
    './arrayCopy',
    '../lang/isArguments',
    '../lang/isArray',
    './isArrayLike',
    '../lang/isPlainObject',
    '../lang/isTypedArray',
    '../lang/toPlainObject'
], function (arrayCopy, isArguments, isArray, isArrayLike, isPlainObject, isTypedArray, toPlainObject) {
    var undefined;
    function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
        var length = stackA.length, srcValue = source[key];
        while (length--) {
            if (stackA[length] == srcValue) {
                object[key] = stackB[length];
                return;
            }
        }
        var value = object[key], result = customizer ? customizer(value, srcValue, key, object, source) : undefined, isCommon = result === undefined;
        if (isCommon) {
            result = srcValue;
            if (isArrayLike(srcValue) && (isArray(srcValue) || isTypedArray(srcValue))) {
                result = isArray(value) ? value : isArrayLike(value) ? arrayCopy(value) : [];
            } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
                result = isArguments(value) ? toPlainObject(value) : isPlainObject(value) ? value : {};
            } else {
                isCommon = false;
            }
        }
        stackA.push(srcValue);
        stackB.push(result);
        if (isCommon) {
            object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
        } else if (result === result ? result !== value : value === value) {
            object[key] = result;
        }
    }
    return baseMergeDeep;
});