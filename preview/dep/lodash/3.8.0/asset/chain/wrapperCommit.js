define('lodash/chain/wrapperCommit', ['../internal/LodashWrapper'], function (LodashWrapper) {
    function wrapperCommit() {
        return new LodashWrapper(this.value(), this.__chain__);
    }
    return wrapperCommit;
});