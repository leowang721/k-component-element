define('lodash/chain/tap', [], function () {
    function tap(value, interceptor, thisArg) {
        interceptor.call(thisArg, value);
        return value;
    }
    return tap;
});