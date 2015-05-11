define('lodash/internal/createBaseEach', [
    './getLength',
    './isLength',
    './toObject'
], function (getLength, isLength, toObject) {
    function createBaseEach(eachFunc, fromRight) {
        return function (collection, iteratee) {
            var length = collection ? getLength(collection) : 0;
            if (!isLength(length)) {
                return eachFunc(collection, iteratee);
            }
            var index = fromRight ? length : -1, iterable = toObject(collection);
            while (fromRight ? index-- : ++index < length) {
                if (iteratee(iterable[index], index, iterable) === false) {
                    break;
                }
            }
            return collection;
        };
    }
    return createBaseEach;
});