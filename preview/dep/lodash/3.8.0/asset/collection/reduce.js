define('lodash/collection/reduce', [
    '../internal/arrayReduce',
    '../internal/baseEach',
    '../internal/createReduce'
], function (arrayReduce, baseEach, createReduce) {
    var reduce = createReduce(arrayReduce, baseEach);
    return reduce;
});