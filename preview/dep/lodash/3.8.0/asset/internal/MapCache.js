define('lodash/internal/MapCache', [
    './mapDelete',
    './mapGet',
    './mapHas',
    './mapSet'
], function (mapDelete, mapGet, mapHas, mapSet) {
    function MapCache() {
        this.__data__ = {};
    }
    MapCache.prototype['delete'] = mapDelete;
    MapCache.prototype.get = mapGet;
    MapCache.prototype.has = mapHas;
    MapCache.prototype.set = mapSet;
    return MapCache;
});