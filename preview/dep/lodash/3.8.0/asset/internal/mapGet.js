define('lodash/internal/mapGet', [], function () {
    var undefined;
    function mapGet(key) {
        return key == '__proto__' ? undefined : this.__data__[key];
    }
    return mapGet;
});