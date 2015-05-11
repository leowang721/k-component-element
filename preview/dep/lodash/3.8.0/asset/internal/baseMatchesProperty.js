define('lodash/internal/baseMatchesProperty', [
    './baseGet',
    './baseIsEqual',
    './baseSlice',
    '../lang/isArray',
    './isKey',
    './isStrictComparable',
    '../array/last',
    './toObject',
    './toPath'
], function (baseGet, baseIsEqual, baseSlice, isArray, isKey, isStrictComparable, last, toObject, toPath) {
    var undefined;
    function baseMatchesProperty(path, value) {
        var isArr = isArray(path), isCommon = isKey(path) && isStrictComparable(value), pathKey = path + '';
        path = toPath(path);
        return function (object) {
            if (object == null) {
                return false;
            }
            var key = pathKey;
            object = toObject(object);
            if ((isArr || !isCommon) && !(key in object)) {
                object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
                if (object == null) {
                    return false;
                }
                key = last(path);
                object = toObject(object);
            }
            return object[key] === value ? value !== undefined || key in object : baseIsEqual(value, object[key], null, true);
        };
    }
    return baseMatchesProperty;
});