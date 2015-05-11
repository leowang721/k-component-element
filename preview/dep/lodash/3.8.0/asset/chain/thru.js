define('lodash/chain/thru', [], function () {
    function thru(value, interceptor, thisArg) {
        return interceptor.call(thisArg, value);
    }
    return thru;
});