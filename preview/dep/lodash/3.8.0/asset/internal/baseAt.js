define('lodash/internal/baseAt', [
    './isArrayLike',
    './isIndex'
], function (isArrayLike, isIndex) {
    var undefined;
    function baseAt(collection, props) {
        var index = -1, isNil = collection == null, isArr = !isNil && isArrayLike(collection), length = isArr && collection.length, propsLength = props.length, result = Array(propsLength);
        while (++index < propsLength) {
            var key = props[index];
            if (isArr) {
                result[index] = isIndex(key, length) ? collection[key] : undefined;
            } else {
                result[index] = isNil ? undefined : collection[key];
            }
        }
        return result;
    }
    return baseAt;
});