define('lodash/math/add', [], function () {
    function add(augend, addend) {
        return (+augend || 0) + (+addend || 0);
    }
    return add;
});