define('lodash/internal/getSymbols', [
    '../utility/constant',
    '../lang/isNative',
    './toObject'
], function (constant, isNative, toObject) {
    var getOwnPropertySymbols = isNative(getOwnPropertySymbols = Object.getOwnPropertySymbols) && getOwnPropertySymbols;
    var getSymbols = !getOwnPropertySymbols ? constant([]) : function (object) {
            return getOwnPropertySymbols(toObject(object));
        };
    return getSymbols;
});