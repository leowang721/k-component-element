define('lodash/internal/bufferClone', [
    '../utility/constant',
    '../lang/isNative',
    './root'
], function (constant, isNative, root) {
    var ArrayBuffer = isNative(ArrayBuffer = root.ArrayBuffer) && ArrayBuffer, bufferSlice = isNative(bufferSlice = ArrayBuffer && new ArrayBuffer(0).slice) && bufferSlice, floor = Math.floor, Uint8Array = isNative(Uint8Array = root.Uint8Array) && Uint8Array;
    var Float64Array = function () {
            try {
                var func = isNative(func = root.Float64Array) && func, result = new func(new ArrayBuffer(10), 0, 1) && func;
            } catch (e) {
            }
            return result;
        }();
    var FLOAT64_BYTES_PER_ELEMENT = Float64Array ? Float64Array.BYTES_PER_ELEMENT : 0;
    function bufferClone(buffer) {
        return bufferSlice.call(buffer, 0);
    }
    if (!bufferSlice) {
        bufferClone = !(ArrayBuffer && Uint8Array) ? constant(null) : function (buffer) {
            var byteLength = buffer.byteLength, floatLength = Float64Array ? floor(byteLength / FLOAT64_BYTES_PER_ELEMENT) : 0, offset = floatLength * FLOAT64_BYTES_PER_ELEMENT, result = new ArrayBuffer(byteLength);
            if (floatLength) {
                var view = new Float64Array(result, 0, floatLength);
                view.set(new Float64Array(buffer, 0, floatLength));
            }
            if (byteLength != offset) {
                view = new Uint8Array(result, offset);
                view.set(new Uint8Array(buffer, offset));
            }
            return result;
        };
    }
    return bufferClone;
});