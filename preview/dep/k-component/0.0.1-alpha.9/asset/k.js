define('k-component/k', [
    'require',
    'lodash',
    './lib/zepto',
    'promise',
    './cache',
    './config'
], function (require) {
    var _ = require('lodash');
    var $ = require('./lib/zepto');
    var Promise = require('promise');
    var cache = require('./cache');
    var config = require('./config');
    var isSupportShadowDOM = !!document.body.createShadowRoot;
    var getK = function (el) {
        return cache._data(el, config.CACHED_ACTION_KEY);
    };
    var $k = function (el) {
        return new K(el);
    };
    $k.get = getK;
    $k.$ = function (query, condition) {
        if (typeof query === 'string') {
            var result = $(query, condition);
            if (isSupportShadowDOM) {
                result = $(_.toArray(result).concat(_.toArray($('::shadow ' + query, condition))));
            }
            return result;
        }
        return $(query, condition);
    };
    function K(query) {
        var me = this;
        if (typeof query === 'string') {
            me.target = $k.$(query);
        } else {
            me.target = $(query);
        }
        var promises = [];
        _.each(me.target, function (item) {
            if (!item.promise) {
                setTimeout(function (promise) {
                    promises.push(promise);
                }(item.promise), 1);
            } else {
                promises.push(item.promise);
            }
        });
        me.components = [];
        me.promise = Promise.all(promises).then(function () {
            var index = 0;
            _.each(me.target, function (eachTarget) {
                me[index++] = getK(eachTarget);
                me.components.push(getK(eachTarget));
            });
        });
    }
    K.prototype.execute = function (methodName) {
        var me = this;
        var args = _.toArray(arguments).slice(1);
        me.target && me.promise.then(function () {
            _.each(me.components, function (item) {
                item[methodName].apply(item, args);
            });
        });
    };
    K.prototype.on = function (type, fn, thisObject, options) {
        var args = [].slice.call(arguments);
        args.unshift('on');
        this.execute.apply(this, args);
    };
    K.prototype.ready = function (fn) {
        var args = [].slice.call(arguments);
        args.unshift('ready');
        this.execute.apply(this, args);
    };
    return $k;
});