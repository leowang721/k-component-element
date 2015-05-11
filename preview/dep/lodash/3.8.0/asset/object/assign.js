define('lodash/object/assign', [
    '../internal/assignWith',
    '../internal/baseAssign',
    '../internal/createAssigner'
], function (assignWith, baseAssign, createAssigner) {
    var assign = createAssigner(function (object, source, customizer) {
            return customizer ? assignWith(object, source, customizer) : baseAssign(object, source);
        });
    return assign;
});