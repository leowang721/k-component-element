define('lodash/internal/composeArgsRight', [], function () {
    var nativeMax = Math.max;
    function composeArgsRight(args, partials, holders) {
        var holdersIndex = -1, holdersLength = holders.length, argsIndex = -1, argsLength = nativeMax(args.length - holdersLength, 0), rightIndex = -1, rightLength = partials.length, result = Array(argsLength + rightLength);
        while (++argsIndex < argsLength) {
            result[argsIndex] = args[argsIndex];
        }
        var offset = argsIndex;
        while (++rightIndex < rightLength) {
            result[offset + rightIndex] = partials[rightIndex];
        }
        while (++holdersIndex < holdersLength) {
            result[offset + holders[holdersIndex]] = args[argsIndex++];
        }
        return result;
    }
    return composeArgsRight;
});