define('lodash/internal/getFuncName', [
    './baseProperty',
    '../utility/constant',
    './realNames',
    '../support'
], function (baseProperty, constant, realNames, support) {
    var getFuncName = function () {
            if (!support.funcNames) {
                return constant('');
            }
            if (constant.name == 'constant') {
                return baseProperty('name');
            }
            return function (func) {
                var result = func.name, array = realNames[result], length = array ? array.length : 0;
                while (length--) {
                    var data = array[length], otherFunc = data.func;
                    if (otherFunc == null || otherFunc == func) {
                        return data.name;
                    }
                }
                return result;
            };
        }();
    return getFuncName;
});