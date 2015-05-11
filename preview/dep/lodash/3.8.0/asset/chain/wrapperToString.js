define('lodash/chain/wrapperToString', [], function () {
    function wrapperToString() {
        return this.value() + '';
    }
    return wrapperToString;
});