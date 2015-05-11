define('lodash/collection/reduceRight', [
    '../internal/arrayReduceRight',
    '../internal/baseEachRight',
    '../internal/createReduce'
], function (arrayReduceRight, baseEachRight, createReduce) {
    var reduceRight = createReduce(arrayReduceRight, baseEachRight);
    return reduceRight;
});