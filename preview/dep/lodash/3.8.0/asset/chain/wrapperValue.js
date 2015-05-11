define('lodash/chain/wrapperValue', ['../internal/baseWrapperValue'], function (baseWrapperValue) {
    function wrapperValue() {
        return baseWrapperValue(this.__wrapped__, this.__actions__);
    }
    return wrapperValue;
});