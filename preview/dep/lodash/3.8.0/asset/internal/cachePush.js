define('lodash/internal/cachePush', ['../lang/isObject'], function (isObject) {
    function cachePush(value) {
        var data = this.data;
        if (typeof value == 'string' || isObject(value)) {
            data.set.add(value);
        } else {
            data.hash[value] = true;
        }
    }
    return cachePush;
});