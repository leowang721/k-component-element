define('lodash/internal/mapHas', [], function () {
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function mapHas(key) {
        return key != '__proto__' && hasOwnProperty.call(this.__data__, key);
    }
    return mapHas;
});