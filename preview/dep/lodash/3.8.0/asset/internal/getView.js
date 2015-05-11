define('lodash/internal/getView', [], function () {
    var nativeMax = Math.max, nativeMin = Math.min;
    function getView(start, end, transforms) {
        var index = -1, length = transforms ? transforms.length : 0;
        while (++index < length) {
            var data = transforms[index], size = data.size;
            switch (data.type) {
            case 'drop':
                start += size;
                break;
            case 'dropRight':
                end -= size;
                break;
            case 'take':
                end = nativeMin(end, start + size);
                break;
            case 'takeRight':
                start = nativeMax(start, end - size);
                break;
            }
        }
        return {
            'start': start,
            'end': end
        };
    }
    return getView;
});