define('lodash/function/wrap', [
    '../internal/createWrapper',
    '../utility/identity'
], function (createWrapper, identity) {
    var PARTIAL_FLAG = 32;
    function wrap(value, wrapper) {
        wrapper = wrapper == null ? identity : wrapper;
        return createWrapper(wrapper, PARTIAL_FLAG, null, [value], []);
    }
    return wrap;
});