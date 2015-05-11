define('lodash/internal/basePullAt', ['./isIndex'], function (isIndex) {
    var arrayProto = Array.prototype;
    var splice = arrayProto.splice;
    function basePullAt(array, indexes) {
        var length = array ? indexes.length : 0;
        while (length--) {
            var index = parseFloat(indexes[length]);
            if (index != previous && isIndex(index)) {
                var previous = index;
                splice.call(array, index, 1);
            }
        }
        return array;
    }
    return basePullAt;
});