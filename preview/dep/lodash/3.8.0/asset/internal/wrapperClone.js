define('lodash/internal/wrapperClone', [
    './LazyWrapper',
    './LodashWrapper',
    './arrayCopy'
], function (LazyWrapper, LodashWrapper, arrayCopy) {
    function wrapperClone(wrapper) {
        return wrapper instanceof LazyWrapper ? wrapper.clone() : new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__, arrayCopy(wrapper.__actions__));
    }
    return wrapperClone;
});