define('lodash/chain/wrapperChain', ['./chain'], function (chain) {
    function wrapperChain() {
        return chain(this);
    }
    return wrapperChain;
});