define('lodash/internal/initCloneObject', [], function () {
    function initCloneObject(object) {
        var Ctor = object.constructor;
        if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
            Ctor = Object;
        }
        return new Ctor();
    }
    return initCloneObject;
});