/**
 * @file 简易版cookie from $.cookie
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {
    'use strict';

    var _ = require('underscore');
    var pluses = /\+/g;

    /**
     * 配置或者读取的私有方法
     * @param {string} key 字段
     * @param {*=} value 要设置的值
     * @param {Object=} options 配置
     * @return {string} 数据
     */
    var config = function (key, value, options) {

        // Write
        if (value !== undefined && !_.isFunction(value)) {
            options = _.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires;
                var t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                // use expires attribute, max-age is not supported by IE
                options.expires ?
                    '; expires=' + options.expires.toUTCString() : '',
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling exports.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    /**
     * 默认配置
     */
    config.defaults = {};

    /**
     * URL encode
     * @param {string} s 数据
     * @return {string} encode后的数据
     */
    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    /**
     * URL decode
     * @param {string} s 数据
     * @return {string} decode后的数据
     */
    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    /**
     * 将json转为对应的字符串
     * @param {string} value 数据
     * @return {string} encode后的数据
     */
    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    /**
     * 解析cookie的值
     * @param {string} s 数据
     * @return {string} parse后的数据
     */
    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
        }
        catch(e) {
            return;
        }

        try {
            // If we can't parse the cookie, ignore it, it's unusable.
            return config.json ? JSON.parse(s) : s;
        }
        catch(e) {}
    }

    /**
     * 读取数据
     * @param {string} s 数据
     * @param {?Function} converter 转换工具方法
     * @return {string} 数据
     */
    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return _.isFunction(converter) ? converter(value) : value;
    }

    /**
     * cookie工具空间
     * @module cookie
     */
    var exports = {};

    /**
     * 删除cookie字段
     * @param {string} key 字段
     * @param {?Object} options 配置
     * @return {boolean} 删除成功与否
     */
    exports.remove = exports.removeItem = function (key, options) {
        if (config(key) !== undefined) {
            // Must not alter options, thus extending a fresh object...
            config(key, '', _.extend({}, options, {
                expires: -1
            }));
            return true;
        }
        return false;
    };

    /**
     * 获取某个key对应的数据
     * @param {string} key 字段
     * @return {string} 数据
     */
    exports.get = exports.getItem = function (key) {
        return config(key);
    };

    /**
     * 设置某个key对应的数据
     * @param {string} key 字段
     * @param {*} value 字段
     * @param {?Object} options 配置
     * @return {string} 数据
     */
    exports.set = exports.setItem = function (key, value, options) {
        return config(key, value, options);
    };

    return exports;
});
