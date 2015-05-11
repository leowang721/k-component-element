define('lodash/internal/mapDelete', [], function () {
    function mapDelete(key) {
        return this.has(key) && delete this.__data__[key];
    }
    return mapDelete;
});