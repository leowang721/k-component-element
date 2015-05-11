define('lodash/internal/baseSlice', [], function () {
    var undefined;
    function baseSlice(array, start, end) {
        var index = -1, length = array.length;
        start = start == null ? 0 : +start || 0;
        if (start < 0) {
            start = -start > length ? 0 : length + start;
        }
        end = end === undefined || end > length ? length : +end || 0;
        if (end < 0) {
            end += length;
        }
        length = start > end ? 0 : end - start >>> 0;
        start >>>= 0;
        var result = Array(length);
        while (++index < length) {
            result[index] = array[index + start];
        }
        return result;
    }
    return baseSlice;
});