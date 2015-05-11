define('lodash/array/zip', [
    '../function/restParam',
    './unzip'
], function (restParam, unzip) {
    var zip = restParam(unzip);
    return zip;
});