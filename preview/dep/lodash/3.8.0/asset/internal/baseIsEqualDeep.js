define('lodash/internal/baseIsEqualDeep', [
    './equalArrays',
    './equalByTag',
    './equalObjects',
    '../lang/isArray',
    '../lang/isTypedArray'
], function (equalArrays, equalByTag, equalObjects, isArray, isTypedArray) {
    var argsTag = '[object Arguments]', arrayTag = '[object Array]', objectTag = '[object Object]';
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objToString = objectProto.toString;
    function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
        var objIsArr = isArray(object), othIsArr = isArray(other), objTag = arrayTag, othTag = arrayTag;
        if (!objIsArr) {
            objTag = objToString.call(object);
            if (objTag == argsTag) {
                objTag = objectTag;
            } else if (objTag != objectTag) {
                objIsArr = isTypedArray(object);
            }
        }
        if (!othIsArr) {
            othTag = objToString.call(other);
            if (othTag == argsTag) {
                othTag = objectTag;
            } else if (othTag != objectTag) {
                othIsArr = isTypedArray(other);
            }
        }
        var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
        if (isSameTag && !(objIsArr || objIsObj)) {
            return equalByTag(object, other, objTag);
        }
        if (!isLoose) {
            var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'), othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
            if (valWrapped || othWrapped) {
                return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
            }
        }
        if (!isSameTag) {
            return false;
        }
        stackA || (stackA = []);
        stackB || (stackB = []);
        var length = stackA.length;
        while (length--) {
            if (stackA[length] == object) {
                return stackB[length] == other;
            }
        }
        stackA.push(object);
        stackB.push(other);
        var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);
        stackA.pop();
        stackB.pop();
        return result;
    }
    return baseIsEqualDeep;
});