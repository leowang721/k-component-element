define('lodash/number', [
    './number/inRange',
    './number/random'
], function (inRange, random) {
    return {
        'inRange': inRange,
        'random': random
    };
});