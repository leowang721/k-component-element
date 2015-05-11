define('lodash/collection/pluck', [
    './map',
    '../utility/property'
], function (map, property) {
    function pluck(collection, path) {
        return map(collection, property(path));
    }
    return pluck;
});