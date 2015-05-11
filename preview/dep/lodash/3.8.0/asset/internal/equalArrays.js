define('lodash/internal/equalArrays', [], function () {
    var undefined;
    function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
        var index = -1, arrLength = array.length, othLength = other.length, result = true;
        if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
            return false;
        }
        while (result && ++index < arrLength) {
            var arrValue = array[index], othValue = other[index];
            result = undefined;
            if (customizer) {
                result = isLoose ? customizer(othValue, arrValue, index) : customizer(arrValue, othValue, index);
            }
            if (result === undefined) {
                if (isLoose) {
                    var othIndex = othLength;
                    while (othIndex--) {
                        othValue = other[othIndex];
                        result = arrValue && arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
                        if (result) {
                            break;
                        }
                    }
                } else {
                    result = arrValue && arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
                }
            }
        }
        return !!result;
    }
    return equalArrays;
});