define('lodash/support', ['./internal/root'], function (root) {
    var objectProto = Object.prototype;
    var document = (document = root.window) && document.document;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var support = {};
    (function (x) {
        var Ctor = function () {
                this.x = x;
            }, args = arguments, object = {
                '0': x,
                'length': x
            }, props = [];
        Ctor.prototype = {
            'valueOf': x,
            'y': x
        };
        for (var key in new Ctor()) {
            props.push(key);
        }
        support.funcDecomp = /\bthis\b/.test(function () {
            return this;
        });
        support.funcNames = typeof Function.name == 'string';
        try {
            support.dom = document.createDocumentFragment().nodeType === 11;
        } catch (e) {
            support.dom = false;
        }
        try {
            support.nonEnumArgs = !propertyIsEnumerable.call(args, 1);
        } catch (e) {
            support.nonEnumArgs = true;
        }
    }(1, 0));
    return support;
});