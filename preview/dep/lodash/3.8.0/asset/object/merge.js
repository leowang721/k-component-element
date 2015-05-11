define('lodash/object/merge', [
    '../internal/baseMerge',
    '../internal/createAssigner'
], function (baseMerge, createAssigner) {
    var merge = createAssigner(baseMerge);
    return merge;
});