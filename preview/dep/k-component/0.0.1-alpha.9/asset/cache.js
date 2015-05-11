define('k-component/cache', [
    'require',
    'lodash'
], function (require) {
    var _ = require('lodash');
    var owners = [];
    var caches = [];
    var rparse = /^(?:null|false|true|NaN|\{.*\}|\[.*\])$/;
    var cacheUtil = {
            hasData: function (owner) {
                return owners.indexOf(owner) > -1;
            },
            data: function (target, name, data) {
                return innerData(target, name, data);
            },
            _data: function (target, name, data) {
                return innerData(target, name, data, true);
            },
            removeData: function (target, name) {
                return innerRemoveData(target, name);
            },
            _removeData: function (target, name) {
                return innerRemoveData(target, name, true);
            },
            parseData: function (target, name, cache, value) {
                var data;
                var _eval;
                var key = _.camelize(name);
                if (cache && key in cache) {
                    return cache[key];
                }
                if (arguments.length !== 4) {
                    var attr = 'data-' + name.replace(/([A-Z])/g, '-$1').toLowerCase();
                    value = target.getAttribute(attr);
                }
                if (typeof value === 'string') {
                    if (rparse.test(value) || +value + '' === value) {
                        _eval = true;
                    }
                    try {
                        data = _eval ? eval('0,' + value) : value;
                    } catch (e) {
                        data = value;
                    }
                    if (cache) {
                        cache[key] = data;
                    }
                }
                return data;
            },
            curry: function (target) {
                return {
                    get: _.partial(cacheUtil.data, target),
                    set: _.partial(cacheUtil.data, target),
                    remove: _.partial(cacheUtil.removeData, target),
                    hasData: _.partial(cacheUtil.hasData, target)
                };
            }
        };
    function add(owner) {
        var index = owners.push(owner);
        return caches[index - 1] = { data: {} };
    }
    function innerData(owner, name, data, pvt) {
        var index = owners.indexOf(owner);
        var table = index === -1 ? add(owner) : caches[index];
        var getOne = typeof name === 'string';
        var cache = table;
        if (!pvt) {
            table = table.data;
        }
        if (name && typeof name === 'object') {
            $.mix(table, name);
        } else if (getOne && data !== void 0) {
            table[name] = data;
        }
        if (getOne) {
            if (name in table) {
                return table[name];
            } else if (!pvt && owner && owner.nodeType === 1) {
                return cacheUtil.parseData(owner, name, cache);
            }
        } else {
            return table;
        }
    }
    function innerRemoveData(owner, name, pvt) {
        var index = owners.indexOf(owner);
        if (index > -1) {
            var delOne = typeof name === 'string';
            var table = caches[index];
            var cache = table;
            if (delOne) {
                if (!pvt) {
                    table = table.data;
                }
                if (table) {
                    delOne = table[name];
                    delete table[name];
                }
                if (JSON.stringify(cache) === '{"data":{}}') {
                    owners.splice(index, 1);
                    caches.splice(index, 1);
                }
            }
            return delOne;
        }
    }
    return cacheUtil;
});