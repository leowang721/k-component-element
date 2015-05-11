define('lodash/internal/baseRandom', [], function () {
    var floor = Math.floor;
    var nativeRandom = Math.random;
    function baseRandom(min, max) {
        return min + floor(nativeRandom() * (max - min + 1));
    }
    return baseRandom;
});