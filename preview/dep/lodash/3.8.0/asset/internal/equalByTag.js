define('lodash/internal/equalByTag', [], function () {
    var boolTag = '[object Boolean]', dateTag = '[object Date]', errorTag = '[object Error]', numberTag = '[object Number]', regexpTag = '[object RegExp]', stringTag = '[object String]';
    function equalByTag(object, other, tag) {
        switch (tag) {
        case boolTag:
        case dateTag:
            return +object == +other;
        case errorTag:
            return object.name == other.name && object.message == other.message;
        case numberTag:
            return object != +object ? other != +other : object == +other;
        case regexpTag:
        case stringTag:
            return object == other + '';
        }
        return false;
    }
    return equalByTag;
});